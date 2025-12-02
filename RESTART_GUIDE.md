# Quick Server Restart Guide

## To Apply the New Changes

The streaming improvements and lyrics caching are now in the code, but you need to restart the server to apply them.

### Option 1: Using npm (Recommended)

1. **Stop the current server**:
   - Press `Ctrl + C` in the terminal where the server is running

2. **Start the server again**:
   ```bash
   npm start
   ```

### Option 2: Using the batch file

1. **Stop the current server**:
   - Press `Ctrl + C` in the terminal

2. **Run the start script**:
   ```bash
   start-electron.bat
   ```

### Option 3: Manual restart

1. **Stop the server**: `Ctrl + C`

2. **Start server**:
   ```bash
   node server.js
   ```

3. **In another terminal, start the client**:
   ```bash
   cd client
   npm run dev
   ```

## What to Expect After Restart

You should see in the server logs:
```
🧹 Cleaned X expired lyrics cache entries on startup
🔄 Trying format: bestaudio[ext=m4a]/bestaudio[ext=webm]/bestaudio
```

## Verify It's Working

1. **Check cache stats**:
   ```bash
   curl http://localhost:5000/lyrics/cache/stats
   ```

2. **Play a song** - You should see format fallback attempts in the logs

3. **Check for successful streaming**:
   ```
   ✅ Successfully got URL with format: bestaudio[ext=m4a]/bestaudio[ext=webm]/bestaudio
   ```

## If Still Having Issues

If you still see "Requested format is not available" after restart:

1. **Update yt-dlp**:
   ```bash
   yt-dlp.exe -U
   ```

2. **Check available formats for a specific video**:
   ```bash
   yt-dlp.exe --list-formats https://www.youtube.com/watch?v=2ub5lOODSD4
   ```

3. **Test direct download**:
   ```bash
   yt-dlp.exe -f "bestaudio[ext=m4a]/bestaudio" https://www.youtube.com/watch?v=2ub5lOODSD4
   ```
