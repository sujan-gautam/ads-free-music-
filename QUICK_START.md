# Quick Start Guide - Music Player Desktop App

## 🚀 Easy Startup (Recommended)

**Double-click:** `start-electron.bat`

This will automatically:
1. Start the backend server (port 3001)
2. Start the frontend dev server (port 5173)
3. Launch the Electron app

Three windows will open - keep them all running while using the app.

## 📋 Manual Startup

If you prefer to start manually, open **3 separate terminals**:

**Terminal 1 - Backend Server:**
```bash
npm start
```

**Terminal 2 - Frontend Dev Server:**
```bash
cd client
npm run dev
```

**Terminal 3 - Electron App:**
```bash
npx electron .
```

## 🛑 How to Stop

- Close the Electron window to stop the app
- Close the terminal windows to stop the servers
- Or press `Ctrl+C` in each terminal

## 🎵 Features

- Search for any song on YouTube
- Play music ad-free
- Create playlists
- Save favorites
- View play history
- Offline caching for faster playback

## 🔧 Troubleshooting

**Blank black screen?**
- Make sure all 3 services are running (backend, frontend, Electron)
- Press `Ctrl+R` to reload the Electron window

**Port already in use?**
- Close any other instances of the app
- Check Task Manager for node.exe processes

**App won't start?**
- Make sure you ran `npm install` in both root and client folders
- Check that ports 3001 and 5173 are available

## 📦 Building for Distribution

To create a standalone executable:

```bash
cd client
npm run build
cd ..
npm run electron:build
```

Your app will be in the `release/win-unpacked` folder.

Enjoy your ad-free music player! 🎶
