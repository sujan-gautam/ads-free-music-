# 🎵 YouTube Music Streamer

A complete, **ad-free YouTube music streaming application** with instant playback, search functionality, queue management, and a stunning modern UI.

![Status](https://img.shields.io/badge/status-ready-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Features

### 🚀 **Instant Streaming**
- **Zero conversion delays** - Audio streams directly from YouTube using yt-dlp
- First audio chunk arrives in ~1-2 seconds
- Real-time buffering progress

### 🔍 **Smart Search**
- Search YouTube directly from the app
- Rich results with thumbnails, titles, and durations
- Click to play instantly or add to queue

### 🎵 **Full-Featured Music Player**
- Play/pause, next, previous controls
- Seek through tracks with progress bar
- Volume control with mute toggle
- Repeat and shuffle modes
- Real-time progress tracking

### 📋 **Queue Management**
- Add multiple tracks to queue
- View upcoming tracks
- Click to jump to any track
- Remove tracks from queue
- Auto-advance to next track

### ⌨️ **Keyboard Shortcuts**
- `Space` - Play/pause
- `→` - Seek forward 10s
- `←` - Seek backward 10s
- `↑` - Volume up
- `↓` - Volume down

### 🎨 **Premium UI Design**
- **Glassmorphism effects** with frosted glass aesthetics
- **Smooth animations** and transitions
- **Dark mode** with vibrant gradient accents
- **Responsive design** - works on desktop, tablet, and mobile
- **Modern typography** using Inter font

## 🛠️ Tech Stack

### Backend
- **Express.js** - Fast web server
- **Socket.IO** - Real-time communication
- **yt-dlp** - YouTube audio extraction
- **ytdl-core** - Metadata extraction

### Frontend
- **React 18** - UI framework
- **Vite** - Lightning-fast dev server
- **Socket.IO Client** - Real-time updates
- **Axios** - HTTP requests
- **Vanilla CSS** - Custom design system

## 📦 Installation

### Prerequisites
- **Node.js** (v16 or higher)
- **yt-dlp.exe** - Already bundled in `bin/` directory! ✅

### Step 1: Install Backend Dependencies
```bash
cd c:\Users\hp\Downloads\ads-free-musicplayer
npm install
```

### Step 2: Install Frontend Dependencies
```bash
cd client
npm install
```

### Step 3: Verify yt-dlp (Optional)
The project includes yt-dlp.exe in the `bin/` directory. To verify it's working:
```bash
bin\yt-dlp.exe --version
```

> **Note**: No manual yt-dlp installation needed! It's bundled with the project.

## 🚀 Usage

### Start the Backend Server
```bash
cd c:\Users\hp\Downloads\ads-free-musicplayer
npm start
```

The server will start on `http://localhost:5000`

### Start the Frontend Development Server
Open a new terminal:
```bash
cd c:\Users\hp\Downloads\ads-free-musicplayer\client
npm run dev
```

The app will be available at `http://localhost:3000`

### Using the App

1. **Search for Music**
   - Enter a song name, artist, or album in the search bar
   - Click "Search" or press Enter
   - Browse the results with thumbnails and info

2. **Play Music**
   - Click "Play" on any search result for instant playback
   - Or click "Queue" to add it to your playlist

3. **Control Playback**
   - Use the player controls at the bottom
   - Click the progress bar to seek
   - Adjust volume with the slider
   - Enable repeat or shuffle modes

4. **Manage Queue**
   - View upcoming tracks in the "Up Next" section
   - Click "Play" to jump to a track
   - Click "✕" to remove from queue

## 🏗️ Architecture

### Backend Endpoints

- `GET /stream?url=<youtube_url>` - Stream audio in real-time
- `GET /metadata?url=<youtube_url>` - Get video metadata
- `GET /search?q=<query>` - Search YouTube
- `GET /health` - Health check

### Real-Time Communication

Socket.IO is used for:
- Progress updates during buffering
- Client connection tracking

### Streaming Flow

1. User clicks "Play" on a track
2. Frontend requests stream from backend
3. Backend spawns yt-dlp process
4. yt-dlp extracts best audio format
5. Audio chunks stream directly to browser
6. Playback starts within 1-2 seconds

## 🎨 Design System

The app uses a comprehensive design system with:

- **CSS Variables** for consistent theming
- **Glassmorphism** for modern frosted glass effects
- **Gradient Accents** with purple/blue theme
- **Smooth Animations** for all interactions
- **Responsive Grid** that adapts to screen size

## 🔧 Customization

### Change Color Theme

Edit `client/src/index.css` and modify the CSS variables:

```css
:root {
  --primary-start: #8b5cf6;  /* Purple */
  --primary-end: #3b82f6;    /* Blue */
  /* ... other colors */
}
```

### Change Port Numbers

**Backend:** Edit `server.js`
```javascript
const PORT = 5000;
```

**Frontend:** Edit `client/vite.config.js`
```javascript
server: {
  port: 3000,
  // ...
}
```

## 🐛 Troubleshooting

### "yt-dlp not found" Error
- Ensure yt-dlp.exe is downloaded
- Update the path in `server.js`
- Make sure the path uses double backslashes: `C:\\path\\to\\yt-dlp.exe`

### No Audio Playing
- Check browser console for errors
- Ensure backend server is running
- Try a different video URL
- Check if yt-dlp can access YouTube (may need to update)

### Search Not Working
- Ensure backend server is running
- Check network tab for API errors
- Verify yt-dlp is working: `yt-dlp.exe --version`

### Slow Streaming
- Check your internet connection
- Try a different video
- Update yt-dlp to the latest version

## 📝 License

MIT License - feel free to use this project however you like!

## 🙏 Credits

- **yt-dlp** - Amazing YouTube downloader
- **React** - UI framework
- **Express** - Web server
- **Socket.IO** - Real-time communication

## 🚀 Future Enhancements

Potential features to add:
- [ ] Playlist saving (localStorage)
- [ ] History of played tracks
- [ ] Lyrics display
- [ ] Audio equalizer
- [ ] Download tracks locally
- [ ] User accounts and cloud sync
- [ ] Social sharing
- [ ] Audio visualizer

---

**Enjoy your ad-free music streaming! 🎵**
