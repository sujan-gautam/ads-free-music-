# Genius API Setup Guide

## Get Your Genius API Token

1. **Create a Genius Account**
   - Go to https://genius.com/
   - Sign up or log in

2. **Create an API Client**
   - Visit https://genius.com/api-clients
   - Click "New API Client"
   - Fill in the form:
     - **App Name**: YouTube Music Player
     - **App Website URL**: http://localhost:5173
     - **Redirect URI**: http://localhost:5173/callback
   - Click "Save"

3. **Get Your Access Token**
   - After creating the client, click "Generate Access Token"
   - Copy the token (it looks like: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)

4. **Add to Your Environment**
   
   Create a `.env` file in the root directory (`c:\Users\hp\Downloads\ads-free-musicplayer\.env`):
   
   ```env
   # Genius API Token (Required for lyrics fallback)
   GENIUS_API_TOKEN=your_token_here
   
   # Optional: OpenAI API Key for smarter timestamp generation
   OPENAI_API_KEY=your_openai_key_here
   ```

5. **Restart the Server**
   ```bash
   # Stop the current server (Ctrl+C)
   npm start
   ```

## How It Works

The lyrics system now uses a **smart fallback chain**:

1. **YouTube Captions** (First choice - already synced)
   - Best quality, accurate timestamps
   - Works for videos with auto-generated captions

2. **Genius API + Timestamp Generation** (Fallback)
   - Fetches lyrics from Genius.com
   - Automatically generates timestamps using:
     - OpenAI GPT (if API key provided)
     - Heuristic algorithm (if no API key)

## Testing

After adding your Genius API token and restarting:

1. Play a song without YouTube captions (like "Joota Japani" by KR$NA)
2. Click the lyrics button (🎵)
3. Lyrics should now appear with generated timestamps!

## Troubleshooting

**No lyrics appearing?**
- Check that `GENIUS_API_TOKEN` is set in `.env`
- Restart the server after adding the token
- Check server logs for error messages

**Timestamps seem off?**
- Add `OPENAI_API_KEY` for smarter timestamp generation
- Or accept the heuristic timestamps (they're pretty good!)
