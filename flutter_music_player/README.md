# 🎵 Flutter Music Player - iOS App

A complete Flutter iOS music streaming application with all features from the web version, optimized for iPhone 15.

## ✨ Features

### 🚀 **Instant Streaming**
- Zero conversion delays - Audio streams directly from YouTube
- Real-time buffering progress
- Background playback support

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
- Lock screen controls
- Background playback

### 📋 **Queue Management**
- Add multiple tracks to queue
- View upcoming tracks
- Reorder queue items
- Remove tracks from queue
- Auto-advance to next track

### 🎨 **Premium iOS Design**
- Native iOS design language
- Smooth animations and transitions
- Dark mode support
- Responsive design for all iPhone sizes
- Glassmorphism effects

### 📱 **iOS-Specific Features**
- Lock screen media controls
- Control Center integration
- Background audio playback
- AirPlay support
- CarPlay ready

## 📦 Installation Requirements

### Prerequisites
1. **macOS** (required for iOS development)
2. **Xcode** (latest version from App Store)
3. **Flutter SDK** (3.0 or higher)
4. **CocoaPods** (for iOS dependencies)
5. **Apple Developer Account** (for device installation)

### Backend Server
The app requires the Node.js backend server to be running. You can:
1. Run it locally on your Mac
2. Deploy it to a cloud service (Heroku, AWS, etc.)
3. Update the API_URL in `lib/config/api_config.dart`

## 🚀 Setup Instructions

### Step 1: Install Flutter
```bash
# Download Flutter SDK
git clone https://github.com/flutter/flutter.git -b stable
export PATH="$PATH:`pwd`/flutter/bin"

# Verify installation
flutter doctor
```

### Step 2: Install Dependencies
```bash
cd flutter_music_player
flutter pub get
cd ios
pod install
cd ..
```

### Step 3: Configure Backend URL
Edit `lib/config/api_config.dart` and set your backend server URL:
```dart
static const String API_URL = "http://YOUR_SERVER_IP:5000";
```

### Step 4: Open in Xcode
```bash
open ios/Runner.xcworkspace
```

### Step 5: Configure Signing
1. In Xcode, select the Runner project
2. Go to "Signing & Capabilities"
3. Select your Team (Apple Developer Account)
4. Xcode will automatically create a provisioning profile

### Step 6: Run on iPhone 15
1. Connect your iPhone 15 via USB
2. Trust the computer on your iPhone
3. In Xcode, select your iPhone from the device dropdown
4. Click the Run button (▶️) or press Cmd+R

## 📱 Installing on iPhone 15

### Option 1: Direct Installation (Development)
1. Connect iPhone to Mac via USB
2. Run: `flutter run --release`
3. App will install and launch on your iPhone
4. Go to Settings → General → VPN & Device Management
5. Trust your developer certificate

### Option 2: TestFlight (Recommended for Distribution)
1. Create an app in App Store Connect
2. Archive the app in Xcode
3. Upload to App Store Connect
4. Add testers in TestFlight
5. Install via TestFlight app on iPhone

### Option 3: Ad-Hoc Distribution
1. Create an Ad-Hoc provisioning profile
2. Archive and export the IPA
3. Install via Apple Configurator or Xcode

## 🔧 Configuration

### Background Audio
The app is pre-configured for background audio playback with:
- Audio session category: playback
- Background modes enabled
- Lock screen controls

### Network Security
For local development, the app allows HTTP connections to localhost.
For production, ensure your backend uses HTTPS.

## 🏗️ Project Structure

```
flutter_music_player/
├── lib/
│   ├── main.dart                 # App entry point
│   ├── config/
│   │   └── api_config.dart       # API configuration
│   ├── models/
│   │   ├── track.dart            # Track model
│   │   ├── playlist.dart         # Playlist model
│   │   └── lyrics.dart           # Lyrics model
│   ├── services/
│   │   ├── api_service.dart      # API communication
│   │   ├── audio_service.dart    # Audio playback
│   │   └── storage_service.dart  # Local storage
│   ├── providers/
│   │   ├── player_provider.dart  # Player state management
│   │   ├── queue_provider.dart   # Queue management
│   │   └── library_provider.dart # Library management
│   ├── screens/
│   │   ├── home_screen.dart      # Home view
│   │   ├── search_screen.dart    # Search view
│   │   ├── library_screen.dart   # Library view
│   │   ├── queue_screen.dart     # Queue view
│   │   └── lyrics_screen.dart    # Lyrics view
│   └── widgets/
│       ├── player_bar.dart       # Bottom player
│       ├── track_tile.dart       # Track list item
│       └── playlist_card.dart    # Playlist card
├── ios/                          # iOS-specific files
├── pubspec.yaml                  # Dependencies
└── README.md                     # This file
```

## 📝 Dependencies

- **just_audio**: Audio playback
- **audio_service**: Background audio
- **provider**: State management
- **http**: API communication
- **cached_network_image**: Image caching
- **shared_preferences**: Local storage
- **socket_io_client**: Real-time updates

## 🐛 Troubleshooting

### App won't install on iPhone
- Ensure your Apple ID is added in Xcode
- Check that your device is registered in your developer account
- Verify the bundle identifier is unique

### No audio playing
- Check that backend server is running and accessible
- Verify API_URL is correct
- Check iPhone network connection
- Ensure audio permissions are granted

### Background playback not working
- Verify Background Modes are enabled in Xcode
- Check that audio session is configured correctly
- Ensure the app is not in Low Power Mode

## 📄 License

MIT License - feel free to use this project however you like!

## 🎉 Enjoy!

Your ad-free music streaming app is now ready for iPhone 15! 🎵
