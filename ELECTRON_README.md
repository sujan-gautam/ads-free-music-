# Music Player - Electron Desktop Application

A beautiful, ad-free YouTube music streaming desktop application built with Electron, React, and Node.js.

## 🚀 Features

- **Cross-Platform**: Works on Windows, macOS, and Linux
- **Ad-Free Streaming**: Enjoy music without interruptions
- **Offline Caching**: Songs are cached for faster playback
- **Playlists & Favorites**: Create and manage your music library
- **Search**: Find any song on YouTube
- **Beautiful UI**: Modern, responsive design with smooth animations

## 📦 Installation

### Prerequisites

- Node.js 16 or higher
- npm or yarn

### Setup

1. Clone or download this repository
2. Install dependencies:

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

## 🎵 Running the Application

### Development Mode

To run the app in development mode with hot-reload:

```bash
npm run electron:dev
```

This will:
1. Start the backend server on port 3001
2. Start the Vite dev server on port 5173
3. Launch the Electron application with DevTools enabled

### Production Build

To build the application for distribution:

```bash
# Build for current platform
npm run electron:build

# Build for specific platforms
npm run package:win    # Windows
npm run package:mac    # macOS
npm run package:linux  # Linux
```

The built applications will be in the `release` folder.

## 📁 Project Structure

```
ads-free-musicplayer/
├── electron-main.js          # Electron main process
├── electron-preload.js       # Preload script for security
├── server.js                 # Express backend server
├── package.json              # Root package.json with Electron config
├── client/                   # React frontend
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── build/                    # Application icons
│   ├── icon.png
│   ├── icon.ico
│   └── icon.icns
└── cache/                    # Audio cache directory
```

## 🔧 Configuration

### Backend Server

The backend server runs on port 3001 by default in Electron mode. You can change this in `electron-main.js`:

```javascript
const SERVER_PORT = 3001; // Change this value
```

### Build Configuration

The build configuration is in `package.json` under the `build` key. You can customize:

- App name and ID
- Icons
- Target platforms
- Installer options
- Files to include/exclude

## 🛠️ Development

### Hot Reload

In development mode, the React frontend supports hot-reload. The backend server will need to be restarted manually if you make changes to `server.js`.

### DevTools

Press `Ctrl+Shift+I` (Windows/Linux) or `Cmd+Option+I` (macOS) to open DevTools in development mode.

## 📝 Building for Distribution

### Windows

```bash
npm run package:win
```

Creates:
- NSIS installer (.exe)
- Portable executable

### macOS

```bash
npm run package:mac
```

Creates:
- DMG installer
- ZIP archive

### Linux

```bash
npm run package:linux
```

Creates:
- AppImage (universal)
- DEB package (Debian/Ubuntu)

## 🐛 Troubleshooting

### Port Already in Use

If port 3001 is already in use, change the `SERVER_PORT` in `electron-main.js`.

### Build Fails

Make sure you have:
1. Built the React frontend: `cd client && npm run build`
2. All dependencies installed in both root and client directories
3. Proper icons in the `build` folder

### App Won't Start

Check the console output for errors. Common issues:
- Backend server failed to start
- Missing dependencies
- Incorrect file paths

## 📄 License

MIT

## 🙏 Credits

Built with:
- [Electron](https://www.electronjs.org/)
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Express](https://expressjs.com/)
- [yt-dlp](https://github.com/yt-dlp/yt-dlp)
