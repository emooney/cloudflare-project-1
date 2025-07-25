import { Hono } from "hono";
import { Ai } from "@cloudflare/ai";

interface Env {
  AI: any;
  ASSETS: Fetcher;
}

const app = new Hono<{ Bindings: Env }>();

// Serve the main HTML file
app.get('/', async (c) => {
  try {
    // Use the ASSETS binding to fetch the index.html file
    const response = await c.env.ASSETS.fetch(
      new Request(new URL("/index.html", c.req.url).toString())
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch index.html: ${response.status} ${response.statusText}`);
    }
    
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Error serving index.html:', error);
    return c.text('Error loading page', 500);
  }
});

// Serve static files using the ASSETS binding
app.get('/static/*', async (c) => {
  try {
    const url = new URL(c.req.url);
    const response = await c.env.ASSETS.fetch(
      new Request(url.toString())
    );
    
    if (!response.ok) {
      return c.notFound();
    }
    
    return response;
  } catch (error) {
    console.error('Error serving static file:', error);
    return c.text('Error loading resource', 500);
  }
});

// API endpoint for AI chat
app.get('/api/chat', async (c) => {
  const ai = new Ai(c.env.AI);
  const model = "@cf/mistral/mistral-7b-instruct-v0.1";

  const content = c.req.query("query") || "Hello, how are you?";
  
  const messages = [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content }
  ];

  try {
    const response = await ai.run(model, {
      messages,
      stream: true
    });

    // Create a TransformStream to process the response
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();

    // Process the stream
    (async () => {
      const reader = (response as ReadableStream).getReader();
      let buffer = '';
      
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          // Decode the chunk and add to buffer
          const chunk = new TextDecoder().decode(value, { stream: true });
          buffer += chunk;
          
          // Process complete lines
          const lines = buffer.split('\n');
          buffer = lines.pop() || ''; // Keep incomplete line in buffer
          
          for (let line of lines) {
            line = line.trim();
            if (!line) continue; // Skip empty lines
            
            // Handle SSE format (starts with 'data: ')
            if (line.startsWith('data: ')) {
              const jsonStr = line.substring(6).trim();
              if (!jsonStr) continue;
              
              try {
                const data = JSON.parse(jsonStr);
                if (data.response) {
                  // Forward just the response part as SSE
                  await writer.write(encoder.encode(`data: ${JSON.stringify({ response: data.response })}\n\n`));
                }
              } catch (e) {
                console.error('Error parsing JSON:', e, 'Line:', line);
              }
            } else {
              // Handle non-SSE format (direct JSON)
              try {
                const data = JSON.parse(line);
                if (data.response) {
                  // Format as SSE with just the response text
                  await writer.write(encoder.encode(`data: ${JSON.stringify({ response: data.response })}\n\n`));
                }
              } catch (e) {
                console.error('Error parsing chunk:', e, 'Line:', line);
              }
            }
          }
        }
      } catch (e) {
        console.error('Stream error:', e);
      } finally {
        await writer.close();
      }
    })();

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error in AI request:', error);
    return c.json({ error: 'Failed to process request' }, 500);
  }
});

export default app;
