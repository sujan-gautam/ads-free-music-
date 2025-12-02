# Environment Variables Configuration

## For Vercel Deployment

Add these environment variables in your Vercel project settings:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

### Required Variables:

**`VITE_API_BASE_URL`**
- Description: Your backend API URL
- Example: `https://your-backend.onrender.com`
- For production deployment

**`VITE_SOCKET_URL`**
- Description: Your Socket.IO server URL
- Example: `https://your-backend.onrender.com`
- Usually same as API_BASE_URL

## For Local Development

Create a `.env.local` file in the `client/` directory:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

This file is gitignored and won't be committed.

## How It Works

The app uses these environment variables with fallbacks:

```javascript
const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";
```

- **Production (Vercel)**: Uses the environment variables you set in Vercel
- **Development**: Falls back to `localhost:5000` if variables aren't set

## After Adding Variables

1. Redeploy your Vercel project
2. The app will now connect to your backend instead of localhost

## Troubleshooting

**Still getting ERR_CONNECTION_REFUSED?**
- Check that you've added the environment variables in Vercel
- Make sure your backend is deployed and accessible
- Verify the URLs don't have trailing slashes
- Redeploy after adding variables
