import { Hono } from "hono";
import { Ai } from "@cloudflare/ai";

export interface Env {
	AI: any;	
}	

const app = new Hono<{ Bindings: Env }>();

// GET /?query=What is the capital of France?
app.get('/', async (c) => {

	const ai = new Ai(c.env.AI);

	const model = "@cf/mistral/mistral-7b-instruct-v0.1";	

	const content = c.req.query("query") || "Hello, how are you?";
	
	const messages = [
		{ role: "system", content: "You are a helpful assistant." },
		{ role: "user", content }
	];

	const inputs = { messages };
	const res = await ai.run(model, inputs)

	return c.json({ res });
});

export default app;
