# Order Book Frontend

A Next.js application for managing orders through a 9-stage workflow.

## Environment Configuration

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
```

### Environment Variables

- `NEXT_PUBLIC_BACKEND_URL`: The URL of the backend API server (defaults to http://localhost:8080)

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables (see above)

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Features

- Create and manage orders through 9 stages
- Real-time status tracking
- WhatsApp notifications
- Sequential order numbering
- Daily pending orders reports