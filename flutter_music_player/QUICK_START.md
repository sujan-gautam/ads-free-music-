# 🚀 Quick Start Guide - Flutter Music Player for iPhone 15

## TL;DR - Fastest Way to Get Started

### Prerequisites Checklist
- [ ] Mac computer
- [ ] iPhone 15 with USB cable
- [ ] Xcode installed
- [ ] Flutter installed
- [ ] Backend server accessible

### 5-Minute Setup (If you have Flutter & Xcode)

```bash
# 1. Navigate to the project
cd /path/to/ads-free-musicplayer/flutter_music_player

# 2. Update API URL in lib/config/api_config.dart
# Change "http://localhost:5000" to your Mac's IP or server URL

# 3. Install dependencies
flutter pub get
cd ios && pod install && cd ..

# 4. Connect iPhone 15 via USB

# 5. Run the app
flutter run --release
```

### First-Time Setup (30 minutes)

#### 1. Install Flutter (10 min)
```bash
cd ~/Development
git clone https://github.com/flutter/flutter.git -b stable
echo 'export PATH="$PATH:$HOME/Development/flutter/bin"' >> ~/.zshrc
source ~/.zshrc
flutter doctor
```

#### 2. Install Xcode (from App Store) (15 min)
- Open App Store
- Search "Xcode"
- Install (large download)

#### 3. Install CocoaPods (2 min)
```bash
sudo gem install cocoapods
```

#### 4. Setup Project (3 min)
```bash
cd flutter_music_player
flutter pub get
cd ios && pod install && cd ..
```

#### 5. Configure & Run
1. Open `ios/Runner.xcworkspace` in Xcode
2. Select your Apple ID in Signing & Capabilities
3. Connect iPhone 15
4. Click Run (▶️)
5. Trust developer on iPhone: Settings → General → VPN & Device Management

## Backend Server Setup

### Option 1: Local (Development)
```bash
# Terminal 1: Start backend
cd /path/to/ads-free-musicplayer
npm install
npm start

# Terminal 2: Run Flutter app
cd flutter_music_player
flutter run --release
```

**Important:** Update `lib/config/api_config.dart` with your Mac's IP:
```dart
static const String API_URL = "http://192.168.1.XXX:5000";
```

Find your Mac's IP: System Preferences → Network

### Option 2: Cloud (Production)
1. Deploy backend to Heroku/AWS/etc.
2. Update API_URL with your server URL:
```dart
static const String API_URL = "https://your-server.com";
```

## Common Issues & Quick Fixes

### "Flutter not found"
```bash
export PATH="$PATH:$HOME/Development/flutter/bin"
```

### "CocoaPods not installed"
```bash
sudo gem install cocoapods
```

### "Untrusted Developer"
Settings → General → VPN & Device Management → Trust

### "Can't connect to backend"
- Check backend is running: `curl http://YOUR_IP:5000/health`
- Verify API_URL in api_config.dart
- Ensure iPhone and Mac on same WiFi

### Build fails
```bash
flutter clean
flutter pub get
cd ios && pod install && cd ..
flutter build ios
```

## Project Structure

```
flutter_music_player/
├── lib/
│   ├── main.dart              # App entry point
│   ├── config/
│   │   └── api_config.dart    # ⚠️ UPDATE THIS
│   ├── models/                # Data models
│   ├── services/              # API & Audio services
│   ├── providers/             # State management
│   ├── screens/               # UI screens
│   └── widgets/               # Reusable widgets
├── ios/                       # iOS-specific files
├── pubspec.yaml              # Dependencies
└── README.md                 # Documentation
```

## Key Files to Modify

1. **`lib/config/api_config.dart`** - Backend URL ⚠️ MUST UPDATE
2. **`ios/Runner/Info.plist`** - iOS permissions & settings
3. **`lib/screens/`** - Add your custom UI screens

## Testing Checklist

- [ ] App launches
- [ ] Can search for music
- [ ] Can play a track
- [ ] Audio plays in background
- [ ] Lock screen controls work
- [ ] Volume control works
- [ ] Next/Previous works

## Next Steps

1. ✅ Get the app running
2. 📱 Test basic functionality
3. 🎨 Customize the UI
4. 🎵 Implement full features
5. 🚀 Deploy to TestFlight or App Store

## Useful Commands

```bash
# Run app
flutter run --release

# Build for iOS
flutter build ios

# Clean project
flutter clean

# Check Flutter setup
flutter doctor

# Update Flutter
flutter upgrade

# View logs
flutter logs
```

## Getting Help

1. Check `INSTALLATION_GUIDE.md` for detailed instructions
2. Run `flutter doctor` to diagnose issues
3. Check Xcode console for errors
4. Verify backend with: `curl http://YOUR_IP:5000/health`

## Production Deployment

### TestFlight (Recommended)
1. Archive in Xcode: Product → Archive
2. Upload to App Store Connect
3. Add testers in TestFlight
4. Share TestFlight link

### App Store
1. Complete app metadata in App Store Connect
2. Submit for review
3. Wait for approval (1-3 days)
4. Release to App Store

---

**Ready to rock! 🎸** Your music player is now ready for iPhone 15!

For detailed instructions, see `INSTALLATION_GUIDE.md`
