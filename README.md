# MoMo Press - USSD & SMS Transaction Reader

A full-stack React Native application that combines USSD transaction sending with automatic SMS parsing for comprehensive money transfer insights. Features user authentication, transaction history, spending analytics, and per-user data isolation.

**Tech Stack:** React Native + TypeScript + Express.js + SQLite + JWT Auth

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Documentation](#documentation)

---

## 🎯 Project Overview

MoMo Press is a unified mobile application that helps users manage their mobile money transactions. It:

1. **Reads USSD Responses** - Sends USSD codes to perform transactions
2. **Parses SMS Messages** - Automatically extracts transaction data from MoMo SMS alerts
3. **Tracks Spending** - Shows detailed spending breakdown and analytics
4. **Manages Transactions** - Stores all transactions with user-specific data isolation
5. **Authenticates Users** - Phone number + password based login with JWT tokens

**Data Isolation:** Each user can only see their own transactions (identified by phone number).

### Architecture
- **Frontend:** React Native + TypeScript (Android/iOS compatible)
- **Backend:** Node.js/Express + SQLite + JWT
- **Authentication:** Phone-based signup with password
- **Database:** SQLite (local on device + backend)
- **State Management:** React Context + AsyncStorage

---

## ✨ Key Features

- ✅ User Registration & Login (phone + password)
- ✅ Transaction History & Search
- ✅ Spending Analytics (charts & breakdown)
- ✅ SMS Message Parsing (auto-detect transaction types)
- ✅ USSD Integration (send money, check balance)
- ✅ Per-User Data Isolation
- ✅ Persistent Authentication (AsyncStorage)
- ✅ Error Handling & User Feedback
- ✅ TypeScript for type safety
- ✅ Full backend REST API

---

## 🚀 Quick Start

### Automated Setup (Recommended)
```bash
# Clone the repo (already done)
cd USSD_IMPLEMENTATION

# Run auto setup
bash setup.sh
```

### Manual Setup

**1. Start Backend**
```bash
cd backend
npm install
npm run dev
```
Expected: `Server running on http://localhost:3000`

**2. Get Local IP Address**
```bash
# Linux/Mac
ifconfig | grep "inet "

# Windows
ipconfig

# Update this in: mpressClean/src/api/config.ts
```

**3. Start Frontend Metro Bundler**
```bash
cd mpressClean
npm install  # if needed
npm start
```

**4. Run on Android Device/Emulator**
```bash
cd mpressClean
npx react-native run-android
```

See [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) for detailed setup instructions.

---

## 🏗️ Architecture

```
┌─────────────────────────┐
│   React Native App      │
│ (TypeScript + Context)  │
└────────────┬────────────┘
             │ HTTP (Fetch)
             ↓
┌─────────────────────────┐
│  Express API Server     │
│  (Node.js + SQLite)     │
│  • Auth (JWT + bcrypt)  │
│  • Transactions         │
│  • SMS Logs             │
└─────────────────────────┘
```

---

## 📁 Project Structure

```
USSD_IMPLEMENTATION/
├── backend/                    # Node.js Express API
│   ├── src/server.ts          # Main API server
│   ├── package.json
│   └── tsconfig.json
│
├── mpressClean/               # React Native App
│   ├── src/
│   │   ├── screens/           # UI screens
│   │   ├── context/           # Auth context
│   │   ├── api/               # API config
│   │   ├── services/          # Business logic
│   │   ├── utils/             # SMS parser
│   │   └── database/          # DB schema
│   ├── App.tsx                # Main app
│   ├── index.js               # Entry point
│   └── android/               # Android config
│
├── INTEGRATION_GUIDE.md       # Complete setup guide
├── PROJECT_STATUS.md          # Development status
└── setup.sh                   # Auto setup script
```

---

## 📚 Documentation

##  Prerequisites

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

##  Installation

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

##  Running the Application

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

##  Project Structure

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

##  Features

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

##  Dependencies

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

##  Common Commands

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

##  Troubleshooting

### Backend API
```bash
# Health check
curl http://localhost:3000/health

# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","phone_number":"+250789123456","password":"test123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"+250789123456","password":"test123"}'
```

See [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md#-manual-testing) for detailed testing instructions.

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Backend connection fails | Check IP in `src/api/config.ts` matches your machine |
| "Token expired" 401 error | Clear AsyncStorage and re-login |
| Phone already registered | Use a different phone number for testing |
| Metro won't start | `npm start -- --reset-cache` |
| Android device not detected | `adb kill-server && adb start-server` |
| SMS not parsing | Check SMS format in `paerseMomoMessage.ts` |

Full troubleshooting in [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md#-troubleshooting).

---

## 📝 Development Workflow

1. **Start Backend:** `cd backend && npm run dev`
2. **Start Metro:** `cd mpressClean && npm start`
3. **Run App:** `npx react-native run-android`
4. **Make Changes:** Edit code in `src/screens/`, `src/context/`, etc.
5. **Reload:** Press 'R' twice or shake device

---

## 🎯 Next Steps

- [ ] Create SpendingScreen (donut chart)
- [ ] Create HistoryScreen (transaction list)
- [ ] Integrate SMS listener service
- [ ] Test signup/login flow
- [ ] Verify per-user data isolation
- [ ] Build release APK

See [PROJECT_STATUS.md](./PROJECT_STATUS.md) for detailed TODO list.

---

## 👥 Team

- **Janviere Munezero** - USSD & Main App
- **Teammate** - SMS Reading & Transaction Parsing

---

## 📄 License

School assignment project. Modify and use as needed.

---

## 🔗 Quick Links

- 📖 [Full Setup Guide](./INTEGRATION_GUIDE.md)
- 📊 [Project Status & TODO](./PROJECT_STATUS.md)
- 🐙 [GitHub Repository](https://github.com/Janviere-dev/USSD_IMPLEMENTATION)
- 📱 [React Native Docs](https://reactnative.dev)
- 🟢 [Express Docs](https://expressjs.com)
- 💾 [SQLite Docs](https://www.sqlite.org)

---

##  Development Workflow

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

##  Testing USSD Functionality

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

##  Debugging

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

##  Contributing

1. Create a new branch: `git checkout -b feature/your-feature`
2. Make changes and test thoroughly
3. Commit: `git commit -m "Add your feature"`
4. Push: `git push origin feature/your-feature`
5. Create a Pull Request

---

## 📄 License

This project is part of school assignments. Modify and use as needed.

---

##  Author

**Janviere Munezero**
- GitHub: [Janviere-dev](https://github.com/Janviere-dev)
- Repository: [USSD_IMPLEMENTATION](https://github.com/Janviere-dev/USSD_IMPLEMENTATION)

---

##  Getting Help

- **React Native Documentation:** https://reactnative.dev/docs/getting-started
- **USSD Protocol:** https://en.wikipedia.org/wiki/Unstructured_Supplementary_Service_Data
- **Metro Bundler:** https://facebook.github.io/metro/
- **Stack Overflow:** Tag questions with `react-native` and `ussd`

---

##  Quick Start Checklist

- [ ] Node.js installed
- [ ] Android SDK/Studio installed
- [ ] Repository cloned
- [ ] Dependencies installed (`npm install`)
- [ ] Metro bundler started (`npm start`)
- [ ] App running on device/emulator (`npx react-native run-android`)
- [ ] Ready to develop! 

---

**Last Updated:** November 13, 2025
