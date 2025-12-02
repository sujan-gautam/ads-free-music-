# yt-dlp Binary Setup

## For Production (Linux servers like Render/Railway)

The `bin/yt-dlp` file is a Linux binary that will be downloaded automatically during deployment.

### Automatic Download (Recommended)

Add this to your deployment build command:

```bash
curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o bin/yt-dlp && chmod +x bin/yt-dlp && npm install && npm start
```

Or create a `bin/yt-dlp` file manually before deploying.

### Manual Download

Run this script locally (on Mac/Linux):

```bash
chmod +x download-yt-dlp.sh
./download-yt-dlp.sh
```

Then commit the binary:

```bash
git add bin/yt-dlp
git commit -m "Add yt-dlp Linux binary"
git push
```

## For Windows Development

The code automatically detects Windows and uses `bin/yt-dlp.exe` instead.

Keep your `yt-dlp.exe` file in the `bin/` directory (it's gitignored).

## How It Works

The server code automatically selects the right binary:

```javascript
const YTDLP_BINARY = process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp';
const YTDLP = path.join(__dirname, "bin", YTDLP_BINARY);
```

- **Windows**: Uses `bin/yt-dlp.exe`
- **Linux/Mac**: Uses `bin/yt-dlp`

## Deployment Platforms

### Render

Add to **Build Command**:
```bash
curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o bin/yt-dlp && chmod +x bin/yt-dlp && npm install
```

**Start Command**:
```bash
npm start
```

### Railway

Railway auto-detects Node.js. The binary should be committed to git or downloaded in a build script.

### Heroku

Add to `package.json` scripts:

```json
{
  "scripts": {
    "heroku-postbuild": "curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o bin/yt-dlp && chmod +x bin/yt-dlp"
  }
}
```

## Troubleshooting

**Error: ENOENT - yt-dlp not found**
- Make sure `bin/yt-dlp` exists and is executable
- Run: `chmod +x bin/yt-dlp`
- Check the file was committed to git

**Error: Permission denied**
- Run: `chmod +x bin/yt-dlp`
- Or download again with the script

**Binary not working on Linux**
- Make sure you downloaded the Linux version, not Windows .exe
- Verify with: `file bin/yt-dlp` (should say "ELF 64-bit")
