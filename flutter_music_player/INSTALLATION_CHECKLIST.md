# ✅ iPhone 15 Installation Checklist

Use this checklist to track your progress installing the Flutter Music Player on your iPhone 15.

## 📋 Pre-Installation Setup

### Mac Setup
- [ ] Mac computer available (required for iOS development)
- [ ] macOS updated to latest version
- [ ] Stable internet connection
- [ ] At least 20GB free disk space

### Software Installation
- [ ] Xcode installed from App Store
- [ ] Xcode opened and license accepted
- [ ] Command Line Tools installed (`xcode-select --install`)
- [ ] Homebrew installed (optional but recommended)
- [ ] CocoaPods installed (`sudo gem install cocoapods`)
- [ ] Flutter SDK installed and in PATH
- [ ] `flutter doctor` shows no critical issues

### Apple Developer Account
- [ ] Apple ID created
- [ ] Apple ID added to Xcode (Preferences → Accounts)
- [ ] Developer certificate generated (automatic in Xcode)

### iPhone 15 Setup
- [ ] iPhone 15 available
- [ ] USB cable (Lightning or USB-C depending on model)
- [ ] iPhone updated to latest iOS
- [ ] iPhone connected to same WiFi as Mac (for local development)

## 🔧 Project Setup

### Backend Server
- [ ] Backend server code accessible
- [ ] Node.js installed
- [ ] Backend dependencies installed (`npm install`)
- [ ] Backend server starts successfully (`npm start`)
- [ ] Backend accessible at http://localhost:5000
- [ ] Health check works: `curl http://localhost:5000/health`

**OR**

- [ ] Backend deployed to cloud service
- [ ] Cloud backend URL obtained
- [ ] Cloud backend accessible and working

### Flutter Project
- [ ] Navigated to `flutter_music_player` directory
- [ ] Opened `lib/config/api_config.dart`
- [ ] Updated `API_URL` with correct backend address
- [ ] Saved changes to `api_config.dart`
- [ ] Ran `flutter pub get` successfully
- [ ] Navigated to `ios` directory
- [ ] Ran `pod install` successfully
- [ ] No errors in pod installation

## 🎯 Xcode Configuration

### Open Project
- [ ] Opened `ios/Runner.xcworkspace` in Xcode
- [ ] Project loaded without errors
- [ ] Runner target selected

### Signing & Capabilities
- [ ] Opened Signing & Capabilities tab
- [ ] Selected Team (Apple ID)
- [ ] Changed Bundle Identifier to unique value
- [ ] Automatic signing enabled
- [ ] No signing errors shown

### Background Modes
- [ ] Background Modes capability added
- [ ] "Audio, AirPlay, and Picture in Picture" checked
- [ ] "Background fetch" checked (optional)

### Info.plist
- [ ] `Info.plist` contains background modes
- [ ] Network security settings configured
- [ ] App display name set

## 📱 iPhone Connection

### Physical Connection
- [ ] iPhone 15 connected to Mac via USB
- [ ] iPhone unlocked
- [ ] "Trust This Computer" dialog appeared on iPhone
- [ ] Tapped "Trust" on iPhone
- [ ] Entered iPhone passcode
- [ ] iPhone appears in Xcode device list

### Device Selection
- [ ] iPhone 15 selected in Xcode device dropdown
- [ ] Device shows as "Connected"
- [ ] No connection errors

## 🚀 First Build & Run

### Build Process
- [ ] Clicked Run button (▶️) in Xcode OR ran `flutter run --release`
- [ ] Build started without errors
- [ ] Build completed successfully
- [ ] App installed on iPhone 15
- [ ] App icon appears on iPhone home screen

### Trust Developer
- [ ] Opened Settings on iPhone
- [ ] Navigated to General → VPN & Device Management
- [ ] Found developer certificate
- [ ] Tapped on certificate
- [ ] Tapped "Trust"
- [ ] Confirmed trust in dialog

### First Launch
- [ ] Tapped app icon on iPhone
- [ ] App launched successfully
- [ ] No crash on startup
- [ ] UI appears correctly

## 🎵 Functionality Testing

### Basic Features
- [ ] App opens without crashing
- [ ] Navigation works (Home, Search, Library tabs)
- [ ] UI looks good on iPhone 15 screen
- [ ] Dark theme displays correctly

### Audio Playback (when implemented)
- [ ] Can search for music
- [ ] Search results appear
- [ ] Can tap on a track
- [ ] Audio starts playing
- [ ] Play/pause button works
- [ ] Volume control works
- [ ] Next/previous buttons work

### Background Playback
- [ ] Music plays
- [ ] Pressed home button
- [ ] Music continues playing in background
- [ ] Lock screen shows track info
- [ ] Lock screen controls work
- [ ] Control Center shows player
- [ ] Control Center controls work

### Network Connection
- [ ] App connects to backend
- [ ] No connection errors
- [ ] Data loads successfully
- [ ] Images load correctly

## 🐛 Troubleshooting (If Needed)

### If Build Fails
- [ ] Ran `flutter clean`
- [ ] Ran `flutter pub get`
- [ ] Ran `cd ios && pod deintegrate && pod install`
- [ ] Tried building again

### If App Won't Install
- [ ] Checked bundle identifier is unique
- [ ] Verified signing certificate is valid
- [ ] Disconnected and reconnected iPhone
- [ ] Restarted Xcode
- [ ] Restarted iPhone

### If No Audio
- [ ] Verified backend is running
- [ ] Checked API_URL is correct
- [ ] Tested backend: `curl http://YOUR_IP:5000/health`
- [ ] Checked iPhone volume
- [ ] Checked silent mode switch
- [ ] Verified iPhone and Mac on same network

### If "Untrusted Developer"
- [ ] Went to Settings → General → VPN & Device Management
- [ ] Tapped on developer certificate
- [ ] Tapped "Trust"
- [ ] Tried launching app again

## 📊 Optional Enhancements

### TestFlight Setup
- [ ] Created App Store Connect account
- [ ] Created new app in App Store Connect
- [ ] Archived app in Xcode
- [ ] Uploaded to App Store Connect
- [ ] Added to TestFlight
- [ ] Invited testers
- [ ] Installed via TestFlight on iPhone

### App Store Submission
- [ ] Prepared app metadata
- [ ] Created screenshots
- [ ] Wrote app description
- [ ] Set up privacy policy
- [ ] Submitted for review
- [ ] Received approval
- [ ] Published to App Store

## 🎉 Success Criteria

You've successfully installed the app when:
- ✅ App icon appears on iPhone 15 home screen
- ✅ App launches without crashing
- ✅ UI displays correctly
- ✅ Can navigate between screens
- ✅ Backend connection works
- ✅ (When implemented) Audio plays successfully
- ✅ Background playback works
- ✅ Lock screen controls work

## 📝 Notes & Issues

Use this space to track any issues or notes:

```
Date: ___________
Issue: _________________________________________________
Solution: ______________________________________________

Date: ___________
Issue: _________________________________________________
Solution: ______________________________________________

Date: ___________
Issue: _________________________________________________
Solution: ______________________________________________
```

## 🆘 Quick Help

**Flutter not found:**
```bash
export PATH="$PATH:$HOME/Development/flutter/bin"
```

**Clean and rebuild:**
```bash
flutter clean
flutter pub get
cd ios && pod install && cd ..
flutter run --release
```

**Check backend:**
```bash
curl http://YOUR_IP:5000/health
```

**View Flutter logs:**
```bash
flutter logs
```

## ✨ Completion

- [ ] All critical items checked
- [ ] App running on iPhone 15
- [ ] Basic functionality tested
- [ ] Ready for development/customization

**Installation Date:** _______________
**Time Taken:** _______________
**Status:** ⭐ SUCCESS / ⚠️ PARTIAL / ❌ ISSUES

---

**Congratulations!** 🎊 Your Flutter Music Player is now running on iPhone 15!

Next: Start customizing and adding features!
