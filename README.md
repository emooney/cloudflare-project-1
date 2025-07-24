# Cloudflare Workers AI Starter

A simple Cloudflare Worker that demonstrates how to use the Cloudflare AI SDK to create an AI-powered API endpoint.

## Features

- Simple HTTP endpoint that responds to GET requests
- Integration with Cloudflare's AI models (Mistral 7B)
- Accepts custom queries via URL parameters
- Built with TypeScript and Hono.js

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

## Usage

Make a GET request to the worker's endpoint with an optional `query` parameter:

```bash
# Basic request with default message
http://localhost:8787/

# With a custom query
http://localhost:8787/?query=What is the capital of France?
```

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
