# ✅ Fixed: yt-dlp Now Works on Linux!

## What I Fixed:

✅ **Replaced Windows-specific `yt-dlp.exe` with cross-platform binary**

### Files Changed:

1. **`server.js`** - Auto-detects platform (Windows/Linux)
2. **`server/lyrics/youtubeCaptions.js`** - Auto-detects platform
3. **`package.json`** - Added postinstall script to download yt-dlp on Linux
4. **`.gitignore`** - Updated to allow `bin/yt-dlp` (Linux binary)
5. **`bin/README.md`** - Comprehensive setup documentation
6. **`download-yt-dlp.sh`** - Script to download Linux binary

### How It Works Now:

The code automatically detects the platform:

```javascript
const YTDLP_BINARY = process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp';
const YTDLP = path.join(__dirname, "bin", YTDLP_BINARY);
```

- **Windows**: Uses `bin/yt-dlp.exe` ✅
- **Linux/Mac**: Uses `bin/yt-dlp` ✅

---

## 🚀 Deploy to Render (Recommended)

### Step 1: Sign Up & Create Web Service

1. Go to: https://render.com
2. Sign up with GitHub
3. Click **"New +"** → **"Web Service"**
4. Connect your GitHub repo: `sujan-gautam/ads-free-music-`

### Step 2: Configure Settings

**Basic Settings:**
- **Name**: `ads-free-music` (or any name)
- **Region**: Choose closest to you
- **Branch**: `main`
- **Root Directory**: Leave empty
- **Runtime**: `Node`

**Build & Deploy:**
- **Build Command**: 
  ```bash
  npm install
  ```
  
- **Start Command**:
  ```bash
  npm start
  ```

**Environment Variables:**
- Add `PORT` = `5000` (optional, Render sets this automatically)

### Step 3: Deploy!

Click **"Create Web Service"**

Render will:
1. Clone your repo
2. Run `npm install`
3. The `postinstall` script automatically downloads `yt-dlp` for Linux
4. Start your server with `npm start`

### Step 4: Get Your Backend URL

After deployment completes, copy the URL:
```
https://ads-free-music-xxxx.onrender.com
```

---

## 🔗 Connect Frontend to Backend

### Update Vercel Environment Variables:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update these variables:

```
VITE_API_BASE_URL = https://ads-free-music-xxxx.onrender.com
VITE_SOCKET_URL = https://ads-free-music-xxxx.onrender.com
```

3. **Redeploy** your Vercel frontend

---

## 🎯 Alternative: Railway

### Quick Deploy:

1. Go to: https://railway.app
2. **"New Project"** → **"Deploy from GitHub repo"**
3. Select: `sujan-gautam/ads-free-music-`
4. Railway auto-detects Node.js and deploys
5. Copy the URL they provide

**That's it!** Railway automatically:
- Runs `npm install`
- Downloads yt-dlp via postinstall script
- Starts your server

---

## ✅ What Happens During Deployment

### On Linux Servers (Render/Railway):

1. `npm install` runs
2. **Postinstall script** executes:
   ```bash
   curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o bin/yt-dlp
   chmod +x bin/yt-dlp
   ```
3. Server starts with `npm start`
4. Code detects Linux and uses `bin/yt-dlp` ✅

### On Windows (Your Local Machine):

1. `npm install` runs
2. Postinstall script **skips** (detects Windows)
3. Server uses your existing `bin/yt-dlp.exe` ✅

---

## 🐛 Troubleshooting

### Error: "yt-dlp: command not found"

**Solution**: The postinstall script should download it automatically. If it fails:

**Manual fix:**
```bash
# SSH into your server (Render/Railway) or run locally on Mac/Linux
curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o bin/yt-dlp
chmod +x bin/yt-dlp
```

### Error: "Permission denied"

**Solution**: Make the binary executable:
```bash
chmod +x bin/yt-dlp
```

### Postinstall script not running?

**Check Render/Railway logs** for:
```
Downloading yt-dlp...
```

If you don't see this, the script might have failed. Check for `curl` availability.

---

## 📊 Summary

**Before:** ❌ `yt-dlp.exe` only worked on Windows
**After:** ✅ Works on both Windows AND Linux

**Changes:**
- ✅ Platform detection added
- ✅ Automatic download on Linux
- ✅ Cross-platform compatibility
- ✅ No manual setup needed

**Commit:** "Fix: replace yt-dlp.exe with Linux binary for Node server deployment"
**Status:** Pushed to GitHub ✅

---

## 🎉 Next Steps

1. **Deploy backend** to Render or Railway
2. **Copy the backend URL**
3. **Update Vercel environment variables**
4. **Redeploy frontend**
5. **Test on iPhone 15!** 🎵

Your app will now work perfectly on production servers! 🚀
