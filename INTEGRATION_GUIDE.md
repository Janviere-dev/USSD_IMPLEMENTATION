# MoMo Press - Backend + Frontend Integration Guide

## 🎯 Project Overview

MoMo Press is a unified React Native application that combines:
- **USSD Transactions**: Send/receive money via USSD codes
- **SMS Transaction Reading**: Parse MoMo SMS messages for transaction insights
- **Transaction History & Analytics**: View spending breakdown, transaction history
- **User Authentication**: Phone number + password login/signup
- **Backend API**: Node.js/Express with SQLite database

---

## 📁 Project Structure

```
USSD_IMPLEMENTATION/
├── mpressClean/              # React Native app
│   ├── src/
│   │   ├── screens/          # React Native screens
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── SignupScreen.tsx
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── SpendingScreen.tsx  (to be created)
│   │   │   ├── HistoryScreen.tsx   (to be created)
│   │   ├── context/          # Auth context & state management
│   │   │   └── AuthContext.tsx
│   │   ├── api/              # API configuration
│   │   │   └── config.ts
│   │   ├── services/         # Business logic (SMS, Transactions)
│   │   ├── database/         # SQLite schema & helpers
│   │   │   └── database.ts
│   │   ├── utils/            # Utility functions
│   │   │   └── paerseMomoMessage.ts  (SMS parser)
│   │   └── types/            # TypeScript types
│   ├── index.js              # App entry point
│   ├── App.tsx               # Main app component (to be updated)
│   ├── package.json          # React Native dependencies
│   └── android/              # Android native code
├── backend/                  # Node.js/Express backend
│   ├── src/
│   │   └── server.ts         # API server
│   ├── package.json          # Backend dependencies
│   ├── tsconfig.json
│   └── .env                  # Environment variables
└── README.md

```

---

## 🚀 Setup Instructions

### Part 1: Backend Setup

#### 1. Navigate to backend folder
```bash
cd backend
```

#### 2. Install dependencies
```bash
npm install
```

#### 3. Build TypeScript
```bash
npm run build
```

#### 4. Start the server (development)
```bash
npm run dev
```

Or for production:
```bash
npm start
```

**Expected Output:**
```
Server running on http://localhost:3000
Connected to SQLite database
```

### Part 2: Frontend Setup

#### 1. Navigate to mpressClean folder
```bash
cd mpressClean
```

#### 2. Update API URL
Edit `src/api/config.ts` and set your backend URL:
```typescript
export const API_BASE_URL = 'http://YOUR_LOCAL_IP:3000';
// Example: 'http://192.168.1.100:3000'
```

**To find your local IP:**
- **Linux/Mac**: `ifconfig | grep "inet "`
- **Windows**: `ipconfig`

#### 3. Install dependencies (if needed)
```bash
npm install
```

#### 4. Start Metro bundler
```bash
npm start
```

#### 5. Run on Android
In a new terminal:
```bash
npx react-native run-android
```

---

## 🔐 Authentication Flow

### User Registration (Signup)
1. User enters: Name, Phone Number, Password
2. **Frontend** sends POST request to `/api/auth/register`
3. **Backend** validates phone uniqueness, hashes password
4. **Backend** returns JWT token + user data
5. **Frontend** stores token in AsyncStorage
6. User navigated to HomeScreen

### User Login
1. User enters: Phone Number, Password
2. **Frontend** sends POST request to `/api/auth/login`
3. **Backend** verifies phone exists and password matches
4. **Backend** returns JWT token + user data
5. **Frontend** stores token and persists user session
6. User navigated to HomeScreen

### Data Isolation
- **Each user** has a unique phone_number (primary key)
- All transactions, SMS logs, and settings are filtered by `phone_number`
- User cannot access other users' data (enforced by backend authMiddleware)

---

## 🔌 API Endpoints

### Authentication
```
POST /api/auth/register
  Body: { name, phone_number, password }
  Response: { user, token }

POST /api/auth/login
  Body: { phone, password }
  Response: { user, token }
```

### Transactions
```
GET /api/transactions
  Headers: Authorization: Bearer <token>
  Response: { transactions: [...] }

POST /api/transactions
  Headers: Authorization: Bearer <token>
  Body: { type, amount, recipient_name, recipient_phone, description }
  Response: { id, message }
```

### SMS Logs
```
POST /api/sms/log
  Headers: Authorization: Bearer <token>
  Body: { sms_text, parsed_data }

GET /api/sms/logs
  Headers: Authorization: Bearer <token>
  Response: { logs: [...] }
```

### Analytics
```
GET /api/analytics/spending
  Headers: Authorization: Bearer <token>
  Response: { spending: [...] }
```

---

## 📱 Integrating SMS Reading (Android)

### 1. Add Permissions to AndroidManifest.xml
```xml
<uses-permission android:name="android.permission.READ_SMS" />
<uses-permission android:name="android.permission.RECEIVE_SMS" />
```

### 2. Request Runtime Permissions
The `new_App.tsx` file has an example of `requestSMSPermission()`.

### 3. Use SMS Parser
Location: `src/utils/paerseMomoMessage.ts`

Example usage:
```typescript
import { parseMomoMessage } from '../utils/paerseMomoMessage';

const smsText = "You have received 5000 RWF from John Doe (***0789)...";
const result = parseMomoMessage(smsText, userPhoneNumber);

// Result:
// {
//   table: 'Money_Transfers',
//   data: {
//     Transfer_Id: 'M-0001',
//     Phone_Number: '+250789123456',
//     Recipient_Name: 'John Doe',
//     Amount: 5000,
//     Transaction_Type: 'received',
//     ...
//   }
// }
```

### 4. Store Parsed Data
Send parsed transaction to backend:
```typescript
const response = await fetch(`${API_BASE_URL}/api/transactions`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({
    type: result.data.Transaction_Type,
    amount: result.data.Amount,
    recipient_name: result.data.Recipient_Name,
    recipient_phone: result.data.Recipient_Phone,
    description: `SMS: ${smsText}`,
  }),
});
```

---

## 🎯 Next Steps to Complete

### TODO: Create Missing Screens
1. **SpendingScreen.tsx** - Show spending breakdown (donut chart)
2. **HistoryScreen.tsx** - List all transactions
3. **SendMoneyScreen.tsx** - USSD integration to send money
4. **SettingsScreen.tsx** - User settings, logout

### TODO: Wire Navigation
Update `App.tsx` to use React Navigation:
```typescript
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
```

### TODO: SMS Service Integration
1. Set up SMS listener that runs on app startup
2. Parse incoming MoMo SMS messages
3. Send parsed data to backend `/api/transactions` endpoint
4. Display in HistoryScreen

### TODO: Testing Checklist
- [ ] Signup creates user in database
- [ ] Login authenticates user
- [ ] Token stored in AsyncStorage
- [ ] Logout clears token
- [ ] Can fetch user transactions
- [ ] Can store new transaction
- [ ] SMS parsing works
- [ ] Spending analytics calculated correctly
- [ ] Per-user data isolation verified

---

## 🧪 Manual Testing

### Test Signup
```bash
# Use Postman or curl
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","phone_number":"+250789123456","password":"test123"}'
```

### Test Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"+250789123456","password":"test123"}'
```

### Test Transactions
```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -d '{"type":"sent","amount":5000,"recipient_name":"Jane"}'
```

---

## 🐛 Troubleshooting

### "Unable to connect to backend"
- Verify backend is running: `curl http://localhost:3000/health`
- Check IP address in `src/api/config.ts`
- Ensure device/emulator can reach host machine IP

### "Token expired"
- Tokens expire after 7 days
- User will be logged out automatically
- Implement refresh token logic if needed

### "Phone number already registered"
- Phone number must be unique
- Each user = one phone number

### SMS not parsing
- Verify SMS format matches expected patterns in `paerseMomoMessage.ts`
- Different operators have different SMS formats
- May need to add custom parser for your operator

---

## 📚 Resources

- React Native: https://reactnative.dev
- React Navigation: https://reactnavigation.org
- Express.js: https://expressjs.com
- SQLite: https://www.sqlite.org
- JWT: https://jwt.io

---

## 🚀 Deployment Notes

### Frontend (APK Release)
```bash
cd mpressClean
cd android
./gradlew bundleRelease
```

### Backend (Production)
```bash
# Set environment variables
export NODE_ENV=production
export JWT_SECRET=<secure-random-key>
export PORT=3000

# Run server
npm run build
npm start
```

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review server logs: `cat ~/momo_app.db`
3. Check React Native logs: `adb logcat`
4. Review API responses in Postman

---

**Last Updated:** November 14, 2025
**Project Status:** In Development - Core infrastructure complete, screens being created
