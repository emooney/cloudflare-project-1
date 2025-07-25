# AI Chat with Cloudflare Workers

A real-time streaming chat application powered by Cloudflare Workers AI. This application demonstrates how to build a responsive chat interface that streams AI responses using Server-Sent Events (SSE).

## Features

- Real-time streaming chat interface
- Server-Sent Events (SSE) for efficient data streaming
- Integration with Cloudflare's AI models (Mistral 7B)
- Responsive web interface with clean, modern design
- Built with TypeScript, Hono.js, and vanilla JavaScript

## Prerequisites

- Node.js (v16 or later)
- npm (v7 or later)
- Cloudflare account
- Cloudflare Workers CLI (wrangler) - installed automatically as a dev dependency

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd workers-getting-started
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Authenticate with Cloudflare**
   ```bash
   npx wrangler login
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   This will start the development server at `http://localhost:8787`

## Usage

### Web Interface
1. Open your browser to `http://localhost:8787`
2. Type your message in the input field and press Enter or click Send
3. Watch as the AI streams its response in real-time

### API Endpoint
You can also make direct requests to the API endpoint:
```bash
# Basic request with default message
http://localhost:8787/api/chat?query=Hello

# The API returns a Server-Sent Events (SSE) stream with the following format:
# data: {"response":"Hello"}
```

## Project Structure

```
workers-getting-started/
├── public/
│   └── index.html      # Frontend HTML/CSS/JavaScript
├── src/
│   └── index.ts        # Cloudflare Worker code
├── wrangler.jsonc      # Cloudflare Workers configuration
├── package.json        # Project dependencies and scripts
└── README.md           # This file
```

## Deployment

To deploy your application to Cloudflare Workers:

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Cloudflare**
   ```bash
   npx wrangler deploy
   ```

3. **Configure environment variables** (if needed)
   Update the `wrangler.jsonc` file with your Cloudflare account ID and any required environment variables.

## How It Works

1. The frontend sends user messages to the `/api/chat` endpoint
2. The Cloudflare Worker processes the request and streams the AI response using Server-Sent Events (SSE)
3. The frontend displays the streaming response in real-time
4. The application handles connection errors and provides appropriate feedback

## Error Handling

The application includes comprehensive error handling for:
- Network connectivity issues
- Invalid API responses
- Stream parsing errors
- Timeout handling for long-running requests

### Example Response

```json
{
  "response": "The capital of France is Paris."
}
```

## Project Structure

- `src/index.ts` - Main worker code
- `wrangler.jsonc` - Cloudflare Workers configuration
- `package.json` - Project dependencies and scripts

## Available Scripts

- `npm run dev` - Start the development server
- `npm run deploy` - Deploy to Cloudflare Workers
- `npm test` - Run tests
- `npm run cf-typegen` - Generate TypeScript types for your bindings

## Dependencies

- `@cloudflare/ai` - Cloudflare's AI SDK
- `hono` - Fast, lightweight web framework
- `wrangler` - Cloudflare Workers CLI (dev dependency)

## Learn More

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Cloudflare AI Documentation](https://developers.cloudflare.com/ai/)
- [Hono.js Documentation](https://hono.dev/)

## License

MIT
