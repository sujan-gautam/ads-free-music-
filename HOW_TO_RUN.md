# Music Player - How to Run

## 🎵 EASY WAY (Recommended)

**Double-click this file:** `start-electron.bat`

That's it! The app will start automatically.

---

## ❓ Why doesn't Music Player.exe work by itself?

The `.exe` file in the `release` folder is a **production build** that packages everything together, but it's currently configured for development mode.

**For now, always use `start-electron.bat` to run your app.**

---

## 🔧 If You Want a True Standalone .exe

To create a standalone executable that works without the batch file:

1. Make sure the app is NOT running (close all terminals)
2. Open a terminal and run:
   ```bash
   cd client
   npm run build
   cd ..
   npm run electron:build
   ```
3. Wait for the build to complete
4. Your standalone app will be in: `release/win-unpacked/Music Player.exe`

**Note:** The standalone .exe is MUCH larger (200+ MB) because it includes everything.

---

## 📋 Summary

- **For daily use:** Double-click `start-electron.bat`
- **For distribution:** Build the production .exe using the steps above

The batch file is actually the easiest and fastest way to use your app during development!
