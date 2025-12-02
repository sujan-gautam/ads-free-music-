# 📱 Complete Installation Guide for iPhone 15

This guide will walk you through installing the Flutter Music Player on your iPhone 15.

## Prerequisites

### 1. Hardware Requirements
- **Mac computer** (required for iOS development)
- **iPhone 15** with USB cable
- Stable internet connection

### 2. Software Requirements
- **macOS** (latest version recommended)
- **Xcode** (latest version from App Store)
- **Flutter SDK** (3.0 or higher)
- **CocoaPods** (for iOS dependencies)
- **Apple Developer Account** (free or paid)

## Part 1: Setting Up Your Development Environment

### Step 1: Install Xcode
1. Open the **App Store** on your Mac
2. Search for **Xcode**
3. Click **Get** or **Install**
4. Wait for installation (this may take 30+ minutes)
5. Open Xcode and accept the license agreement
6. Install additional components when prompted

### Step 2: Install Command Line Tools
```bash
xcode-select --install
```

### Step 3: Install Homebrew (if not already installed)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Step 4: Install CocoaPods
```bash
sudo gem install cocoapods
```

### Step 5: Install Flutter
```bash
# Download Flutter
cd ~/Development
git clone https://github.com/flutter/flutter.git -b stable

# Add Flutter to PATH
echo 'export PATH="$PATH:$HOME/Development/flutter/bin"' >> ~/.zshrc
source ~/.zshrc

# Verify installation
flutter doctor
```

### Step 6: Accept iOS Licenses
```bash
sudo xcodebuild -license accept
```

## Part 2: Setting Up the Backend Server

### Option A: Run Backend on Your Mac (Recommended for Development)

1. **Find your Mac's local IP address:**
   - Open **System Preferences** → **Network**
   - Note your IP address (e.g., 192.168.1.100)

2. **Start the backend server:**
   ```bash
   cd /path/to/ads-free-musicplayer
   npm install
   npm start
   ```

3. **Keep the server running** while using the app

### Option B: Deploy Backend to Cloud (Recommended for Production)

Deploy your backend to:
- **Heroku** (free tier available)
- **AWS EC2**
- **Google Cloud Platform**
- **DigitalOcean**

Get the public URL of your deployed server.

## Part 3: Configuring the Flutter App

### Step 1: Update API Configuration

1. Open the project in your code editor:
   ```bash
   cd flutter_music_player
   code .  # or use your preferred editor
   ```

2. Edit `lib/config/api_config.dart`:
   ```dart
   class ApiConfig {
     // Replace with your Mac's IP or deployed server URL
     static const String API_URL = "http://192.168.1.100:5000";
     // For deployed server: "https://your-server.herokuapp.com"
   }
   ```

### Step 2: Install Flutter Dependencies
```bash
cd flutter_music_player
flutter pub get
```

### Step 3: Install iOS Dependencies
```bash
cd ios
pod install
cd ..
```

## Part 4: Configuring iOS Project in Xcode

### Step 1: Open Project in Xcode
```bash
open ios/Runner.xcworkspace
```

### Step 2: Configure Signing

1. In Xcode, select **Runner** in the project navigator
2. Select the **Runner** target
3. Go to **Signing & Capabilities** tab
4. **Team**: Select your Apple ID
   - If you don't see your Apple ID:
     - Click **Add Account...**
     - Sign in with your Apple ID
     - Select the newly added account
5. **Bundle Identifier**: Change to something unique
   - Example: `com.yourname.musicplayer`
   - Must be unique across all iOS apps

### Step 3: Enable Background Audio

1. In **Signing & Capabilities**, click **+ Capability**
2. Add **Background Modes**
3. Check these boxes:
   - ✅ Audio, AirPlay, and Picture in Picture
   - ✅ Background fetch

### Step 4: Configure Network Security (for local development)

1. Open `ios/Runner/Info.plist` in Xcode
2. Add the following (if using HTTP for local development):
   ```xml
   <key>NSAppTransportSecurity</key>
   <dict>
       <key>NSAllowsLocalNetworking</key>
       <true/>
       <key>NSAllowsArbitraryLoads</key>
       <true/>
   </dict>
   ```

**Note:** For production, use HTTPS and remove this configuration.

## Part 5: Installing on iPhone 15

### Method 1: Direct Installation via USB (Easiest)

1. **Connect your iPhone 15** to your Mac via USB cable

2. **Trust the computer** on your iPhone:
   - Unlock your iPhone
   - Tap **Trust** when prompted
   - Enter your iPhone passcode

3. **Select your iPhone in Xcode:**
   - In Xcode, click the device dropdown (top-left)
   - Select your iPhone 15 from the list

4. **Build and Run:**
   ```bash
   # From flutter_music_player directory
   flutter run --release
   ```
   
   Or in Xcode:
   - Click the **Play** button (▶️) or press **Cmd+R**

5. **Trust the Developer Certificate on iPhone:**
   - Go to **Settings** → **General** → **VPN & Device Management**
   - Tap on your developer certificate
   - Tap **Trust "[Your Name]"**
   - Tap **Trust** in the confirmation dialog

6. **Launch the app** from your iPhone home screen

### Method 2: TestFlight (Best for Distribution)

1. **Create an App Store Connect Account:**
   - Go to [App Store Connect](https://appstoreconnect.apple.com)
   - Sign in with your Apple Developer account
   - Complete the setup

2. **Create a New App:**
   - Click **My Apps** → **+** → **New App**
   - Fill in app information
   - Bundle ID: Use the same as in Xcode

3. **Archive the App in Xcode:**
   - Select **Any iOS Device** as the build target
   - **Product** → **Archive**
   - Wait for archiving to complete

4. **Upload to App Store Connect:**
   - In the Organizer window, click **Distribute App**
   - Select **App Store Connect**
   - Follow the prompts to upload

5. **Add to TestFlight:**
   - In App Store Connect, go to your app
   - Go to **TestFlight** tab
   - Add internal or external testers
   - Share the TestFlight link

6. **Install via TestFlight:**
   - Install **TestFlight** app from App Store on iPhone
   - Open the TestFlight invitation link
   - Install the app

### Method 3: Ad-Hoc Distribution

1. **Create Ad-Hoc Provisioning Profile:**
   - Go to [Apple Developer Portal](https://developer.apple.com)
   - **Certificates, Identifiers & Profiles**
   - Create Ad-Hoc provisioning profile
   - Add your iPhone's UDID

2. **Archive and Export:**
   - In Xcode: **Product** → **Archive**
   - **Distribute App** → **Ad Hoc**
   - Export IPA file

3. **Install using Apple Configurator:**
   - Download **Apple Configurator** from Mac App Store
   - Connect iPhone
   - Drag and drop IPA file

## Part 6: Troubleshooting

### App Won't Install
**Problem:** "Unable to install app"
**Solution:**
- Ensure bundle identifier is unique
- Check that your Apple ID is verified in Xcode
- Make sure your iPhone is registered in your developer account

### No Audio Playing
**Problem:** App opens but no sound
**Solution:**
- Check that backend server is running
- Verify API_URL in `api_config.dart` is correct
- Ensure iPhone is on the same network as your Mac (for local development)
- Check iPhone volume and silent mode switch

### "Untrusted Developer" Error
**Problem:** Can't open app due to untrusted developer
**Solution:**
- Settings → General → VPN & Device Management
- Trust your developer certificate

### Build Fails in Xcode
**Problem:** Build errors in Xcode
**Solution:**
```bash
# Clean and rebuild
cd flutter_music_player
flutter clean
flutter pub get
cd ios
pod deintegrate
pod install
cd ..
flutter build ios
```

### Backend Connection Issues
**Problem:** App can't connect to backend
**Solution:**
- Verify backend is running: `curl http://YOUR_IP:5000/health`
- Check firewall settings on Mac
- Ensure iPhone and Mac are on same WiFi network
- Try using Mac's IP instead of localhost

## Part 7: Testing the App

### Basic Functionality Test
1. ✅ Open the app
2. ✅ Navigate to Search
3. ✅ Search for a song
4. ✅ Play a track
5. ✅ Test play/pause
6. ✅ Test next/previous
7. ✅ Test volume control
8. ✅ Lock screen and verify controls work
9. ✅ Test background playback

### Network Test
1. ✅ Play a song
2. ✅ Switch to another app
3. ✅ Verify music continues playing
4. ✅ Use lock screen controls

## Part 8: Going to Production

### For Public Release

1. **Get Apple Developer Program membership** ($99/year)
2. **Prepare app for submission:**
   - Add app icons
   - Create screenshots
   - Write app description
   - Set up privacy policy

3. **Submit for App Store Review:**
   - Archive in Xcode
   - Upload to App Store Connect
   - Fill in all required information
   - Submit for review

4. **Wait for approval** (typically 1-3 days)

## Quick Reference Commands

```bash
# Check Flutter installation
flutter doctor

# Get dependencies
flutter pub get

# Run on connected iPhone
flutter run --release

# Build iOS app
flutter build ios

# Clean project
flutter clean

# Update Flutter
flutter upgrade
```

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Run `flutter doctor` to diagnose issues
3. Check Xcode console for error messages
4. Verify backend server is accessible

## Next Steps

After successful installation:
1. Customize the app UI in `lib/screens/`
2. Add more features
3. Implement full search functionality
4. Add lyrics display
5. Implement playlist management

---

**Congratulations!** 🎉 You now have a fully functional music streaming app on your iPhone 15!
