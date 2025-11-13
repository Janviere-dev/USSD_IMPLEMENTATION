# USSD Implementation - React Native Project

A React Native application for USSD (Unstructured Supplementary Service Data) implementation on Android and iOS platforms.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Features](#features)
- [Dependencies](#dependencies)
- [Troubleshooting](#troubleshooting)
- [Development Workflow](#development-workflow)

---

## 🎯 Project Overview

This project is a React Native application that implements USSD functionality. USSD is a protocol used for mobile communications to retrieve data or initiate transactions without an internet connection.

**Key Components:**
- React Native framework for cross-platform mobile development
- TypeScript for type-safe code
- Android and iOS support
- Metro bundler for JavaScript compilation
- Async Storage for persistent data storage
- React Native Send Intent for USSD operations

---

## 📦 Prerequisites

Before you can run this project, ensure you have the following installed:

### Required Software:
- **Node.js** (version 14 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - comes with Node.js
- **Java Development Kit (JDK)** (version 11 or higher) - [Download](https://www.oracle.com/java/technologies/downloads/)
- **Android SDK** and **Android Studio** - [Download](https://developer.android.com/studio)
- **Git** - [Download](https://git-scm.com/)

### For Android Development:
- Android SDK Platform version 31 or higher
- Android Build Tools version 33 or higher
- Android Emulator or a physical Android device (with USB debugging enabled)
- Environment variables set:
  - `ANDROID_HOME` pointing to your Android SDK location
  - `JAVA_HOME` pointing to your JDK installation

### For iOS Development (Mac only):
- Xcode 12 or higher
- CocoaPods
- iOS deployment target 11.0 or higher

---

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/Janviere-dev/USSD_IMPLEMENTATION.git
cd USSD_IMPLEMENTATION
```

### Step 2: Navigate to the Project Directory

```bash
cd mpressClean
```

### Step 3: Install Dependencies

Install all required npm packages:

```bash
npm install
```

This will install:
- React Native core
- @react-native-community/cli (command-line interface)
- @react-native-community/cli-platform-android (Android platform support)
- @react-native-async-storage/async-storage (persistent storage)
- react-native-send-intent (USSD functionality)
- TypeScript and development tools

---

## ▶️ Running the Application

### For Android Development

#### Step 1: Start the Metro Bundler

Open a terminal and run:

```bash
npm start
```

This starts the Metro bundler, which watches your code and compiles JavaScript. Keep this terminal running.

**Output should look like:**
```
Starting Metro Bundler
Press 'i' to open iOS app, 'a' to open Android app, or 'r' to reload the app.
```

#### Step 2: Run the App on Android Device/Emulator

In a **new terminal**, run:

```bash
npx react-native run-android
```

This will:
1. Build the Android APK
2. Install it on your connected device or emulator
3. Launch the app
4. Connect to the Metro bundler for live reload

**First-time setup may take 2-5 minutes.**

### For iOS Development (Mac only)

#### Step 1: Start the Metro Bundler

```bash
npm start
```

#### Step 2: Run the App on iOS Simulator

In a **new terminal**, run:

```bash
npx react-native run-ios
```

Or with a specific simulator:

```bash
npx react-native run-ios --simulator="iPhone 14"
```

---

## 📁 Project Structure

```
mpressClean/
├── src/                          # Source code
│   └── send.js                   # USSD send functionality
├── android/                      # Android native code
│   ├── app/                      # Android app module
│   │   ├── src/
│   │   │   ├── main/            # Main app code
│   │   │   ├── debug/           # Debug configurations
│   │   │   └── release/         # Release configurations
│   │   └── build.gradle         # Android build configuration
│   └── settings.gradle          # Android project settings
├── ios/                          # iOS native code (Xcode project)
├── __tests__/                    # Test files
│   └── App-test.tsx
├── App.tsx                       # Main App component
├── index.js                      # App entry point
├── package.json                  # Project dependencies
├── tsconfig.json                 # TypeScript configuration
├── metro.config.js              # Metro bundler configuration
├── app.json                      # App configuration
└── babel.config.js              # Babel configuration for transpiling

Key Files Explained:
- App.tsx: Root React component
- index.js: Entry point for the app
- send.js: Contains USSD sending logic
- package.json: All dependencies and scripts
```

---

## ✨ Features

### 1. **USSD Protocol Support**
   - Send USSD requests using `react-native-send-intent`
   - Handle USSD responses
   - Support for interactive USSD menus

### 2. **Persistent Storage**
   - Uses AsyncStorage to store user data locally
   - Retains app state across sessions

### 3. **Cross-Platform**
   - Runs on both Android and iOS
   - Shared codebase reduces development time

### 4. **TypeScript Support**
   - Type-safe development
   - Better IDE support and error catching

### 5. **Hot Reload**
   - Metro bundler enables instant code reloading
   - No need to rebuild APK for every code change

---

## 📚 Dependencies

### Production Dependencies:
```json
{
  "react": "18.2.0",                                  // React library
  "react-native": "0.71.8",                           // React Native framework
  "@react-native-async-storage/async-storage": "^2.2.0",  // Local storage
  "react-native-send-intent": "^1.3.0"               // USSD functionality
}
```

### Development Dependencies:
```json
{
  "@react-native-community/cli": "^11.3.0",          // CLI tools
  "@react-native-community/cli-platform-android": "^11.3.0",  // Android support
  "typescript": "4.8.4",                              // TypeScript
  "@babel/core": "^7.20.0",                           // Babel transpiler
  "eslint": "^8.19.0",                                // Code linting
  "jest": "^29.2.1"                                   // Testing framework
}
```

---

## 🔧 Common Commands

```bash
# Start Metro bundler
npm start

# Run on Android
npx react-native run-android

# Run on iOS (Mac only)
npx react-native run-ios

# Run tests
npm test

# Lint code
npm run lint

# Build release APK for Android
cd android && ./gradlew assembleRelease
```

---

## 🛠️ Troubleshooting

### Issue 1: "Unable to load script" on Android

**Problem:** App crashes with "unable to load script" error

**Solution:**
1. Ensure Metro bundler is running: `npm start`
2. Check that your device/emulator can reach your computer on the network
3. Verify your development machine's IP address
4. Clear cache: `npm start -- --reset-cache`

### Issue 2: Gradle build fails

**Problem:** Android build fails with gradle errors

**Solution:**
```bash
# Clean gradle build
cd android && ./gradlew clean
cd .. && npx react-native run-android
```

### Issue 3: Metro bundler won't start

**Problem:** `npm start` fails

**Solution:**
```bash
# Clear Metro cache
rm -rf node_modules/.cache

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try again
npm start
```

### Issue 4: Android device not detected

**Problem:** `npx react-native run-android` says no device found

**Solution:**
```bash
# Check connected devices
adb devices

# If using emulator, make sure it's running
# If using physical device:
# 1. Enable Developer Mode (tap Build Number 7 times in Settings > About)
# 2. Enable USB Debugging
# 3. Connect via USB
# 4. Authorize on device when prompted

# Restart adb
adb kill-server
adb start-server
```

### Issue 5: USSD functionality not working

**Problem:** USSD calls don't work

**Solution:**
1. Check that `react-native-send-intent` is properly installed
2. Ensure app has necessary permissions in `AndroidManifest.xml`
3. Test on physical device (emulator may not support USSD)
4. Verify your mobile operator supports USSD

---

## 💻 Development Workflow

### Hot Reload (Recommended)

1. **Start Metro:**
   ```bash
   npm start
   ```

2. **In another terminal, run the app:**
   ```bash
   npx react-native run-android
   ```

3. **Make code changes** in your editor

4. **On Android Device:**
   - Press `R` twice on the terminal to reload
   - Or shake device and select "Reload"

### Building for Release

#### Android Release APK:

```bash
cd android
./gradlew assembleRelease
```

The APK will be located at: `android/app/build/outputs/apk/release/app-release.apk`

#### Android Release Bundle (for Play Store):

```bash
cd android
./gradlew bundleRelease
```

---

## 📱 Testing USSD Functionality

### Example USSD Codes by Provider:

```javascript
// Airtel
*111#

// Vodafone
*141#

// Jio (India)
*555#

// MTN (Africa)
*156#
```

The actual codes depend on your mobile operator.

---

## 🐛 Debugging

### Enable React Native Debugger

1. Install React Native Debugger from: https://github.com/jhen0409/react-native-debugger
2. Press `Ctrl+M` on Android or shake device and select "Open Debugger"
3. Use browser DevTools to debug

### View Logs

```bash
# View all logs
adb logcat

# Filter React Native logs
adb logcat | grep ReactNative
```

---

## 📝 Contributing

1. Create a new branch: `git checkout -b feature/your-feature`
2. Make changes and test thoroughly
3. Commit: `git commit -m "Add your feature"`
4. Push: `git push origin feature/your-feature`
5. Create a Pull Request

---

## 📄 License

This project is part of school assignments. Modify and use as needed.

---

## 👨‍💻 Author

**Janviere Munezero**
- GitHub: [Janviere-dev](https://github.com/Janviere-dev)
- Repository: [USSD_IMPLEMENTATION](https://github.com/Janviere-dev/USSD_IMPLEMENTATION)

---

## 🆘 Getting Help

- **React Native Documentation:** https://reactnative.dev/docs/getting-started
- **USSD Protocol:** https://en.wikipedia.org/wiki/Unstructured_Supplementary_Service_Data
- **Metro Bundler:** https://facebook.github.io/metro/
- **Stack Overflow:** Tag questions with `react-native` and `ussd`

---

## ✅ Quick Start Checklist

- [ ] Node.js installed
- [ ] Android SDK/Studio installed
- [ ] Repository cloned
- [ ] Dependencies installed (`npm install`)
- [ ] Metro bundler started (`npm start`)
- [ ] App running on device/emulator (`npx react-native run-android`)
- [ ] Ready to develop! 🎉

---

**Last Updated:** November 13, 2025
