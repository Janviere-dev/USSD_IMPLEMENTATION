# 🧪 Testing Guide - MoMo Press

Complete testing procedures to verify the full-stack application works end-to-end.

---

## ✅ Pre-Testing Checklist

- [ ] Node.js v14+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Android Studio installed with SDK
- [ ] Git repository cloned
- [ ] All dependencies installed in both `backend/` and `mpressClean/`
- [ ] Environment variables set (see [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md))

---

## 🔧 Setup (Do This First!)

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Update Frontend IP Address

**Find your machine IP:**
```bash
# Linux/Mac
ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1

# Windows
ipconfig
```

**Update the config:**
```bash
# Edit: mpressClean/src/api/config.ts
# Change this line:
export const API_BASE_URL = 'http://192.168.1.100:3000';  // Use YOUR IP
```

### 3. Install Frontend Dependencies
```bash
cd mpressClean
npm install
```

---

## 🚀 Phase 1: Backend API Testing

### Start Backend Server

**Terminal 1:**
```bash
cd backend
npm run dev
```

**Expected Output:**
```
Server running on http://localhost:3000
```

### Test Health Check Endpoint

**Terminal 2 (new terminal):**
```bash
curl http://localhost:3000/health
```

**Expected Response:**
```json
{"status":"ok"}
```

---

## 📝 Phase 2: API Registration & Login Testing

### Test User Registration

**Test 1: Register First User**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "phone_number": "+250789123456",
    "password": "test123"
  }'
```

**Expected Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "phone_number": "+250789123456",
    "name": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Test 2: Try Duplicate Registration (Should Fail)**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "phone_number": "+250789123456",
    "password": "test456"
  }'
```

**Expected Response (Error 400):**
```json
{"message": "Phone number already registered"}
```

**Test 3: Register Second User (Different Phone)**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "phone_number": "+250788987654",
    "password": "test456"
  }'
```

**Expected Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "phone_number": "+250788987654",
    "name": "Jane Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Test User Login

**Test 1: Login with Correct Password**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+250789123456",
    "password": "test123"
  }'
```

**Expected Response:**
```json
{
  "user": {
    "phone": "+250789123456",
    "name": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Test 2: Login with Wrong Password (Should Fail)**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+250789123456",
    "password": "wrongpassword"
  }'
```

**Expected Response (Error 401):**
```json
{"message": "Invalid password"}
```

**Test 3: Login with Non-Existent User (Should Fail)**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+250799999999",
    "password": "test123"
  }'
```

**Expected Response (Error 401):**
```json
{"message": "User not found"}
```

---

## 💾 Phase 3: Transaction Data Testing

### Save Token for Later Use

```bash
# After login, save the token in a variable
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Add Transactions

**Test 1: User 1 Adds Transaction**
```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "type": "money_transfer",
    "amount": 5000,
    "recipient_info": "Jean Bosco",
    "date": "2024-01-15T10:30:00Z"
  }'
```

**Expected Response:**
```json
{"message": "Transaction added successfully"}
```

**Test 2: Add More Transactions for User 1**
```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "type": "merchant_payment",
    "amount": 2000,
    "recipient_info": "Gas Station",
    "date": "2024-01-15T11:00:00Z"
  }'

curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "type": "airtime",
    "amount": 1000,
    "recipient_info": "MTN Airtime",
    "date": "2024-01-15T12:00:00Z"
  }'
```

### Retrieve User's Transactions (Data Isolation Test)

**Test 1: User 1 Gets Their Transactions**
```bash
curl http://localhost:3000/api/transactions \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
[
  {
    "id": 1,
    "phone_number": "+250789123456",
    "type": "money_transfer",
    "amount": 5000,
    "recipient_info": "Jean Bosco",
    "date": "2024-01-15T10:30:00Z"
  },
  {
    "id": 2,
    "phone_number": "+250789123456",
    "type": "merchant_payment",
    "amount": 2000,
    "recipient_info": "Gas Station",
    "date": "2024-01-15T11:00:00Z"
  },
  {
    "id": 3,
    "phone_number": "+250789123456",
    "type": "airtime",
    "amount": 1000,
    "recipient_info": "MTN Airtime",
    "date": "2024-01-15T12:00:00Z"
  }
]
```

**Test 2: User 1 CANNOT See User 2's Transactions (Data Isolation)**

First, login as User 2 and get their token:
```bash
# Login as User 2
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+250788987654",
    "password": "test456"
  }'

# Save the new token
TOKEN2="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Add a transaction for User 2
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN2" \
  -d '{
    "type": "bank_transfer",
    "amount": 50000,
    "recipient_info": "BK National",
    "date": "2024-01-15T14:00:00Z"
  }'

# Now User 1 tries to see User 2's data (using their Token)
curl http://localhost:3000/api/transactions \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (User 1's transactions only, NOT User 2's):**
```json
[
  {
    "id": 1,
    "phone_number": "+250789123456",
    "type": "money_transfer",
    "amount": 5000,
    ...
  },
  ...
]
```

**IMPORTANT:** User 2's bank transfer (id: 4) should NOT appear in User 1's list!

### Test Analytics Endpoint

```bash
curl http://localhost:3000/api/analytics/spending \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (Spending Breakdown for User 1):**
```json
{
  "money_transfer": 5000,
  "merchant_payment": 2000,
  "airtime": 1000,
  "bank_transfer": 0,
  "bundle": 0,
  "total": 8000
}
```

---

## 📱 Phase 4: Frontend Testing

### Start Metro Bundler

**Terminal 3 (new terminal):**
```bash
cd mpressClean
npm start
```

**Expected Output:**
```
Starting Metro Bundler
Press 'i' to open iOS app, 'a' to open Android app, or 'r' to reload the app.
```

### Run App on Device/Emulator

**Terminal 4 (new terminal):**
```bash
cd mpressClean
npx react-native run-android
```

**Expected:** App starts and shows login screen

---

## 🔐 Phase 5: Frontend Authentication Flow Testing

### Test Signup

1. **Open the app** - Should see login screen
2. **Tap "Create Account"** - Navigate to signup
3. **Enter Details:**
   - Name: `Test User`
   - Phone: `+250789111111`
   - Password: `Test@123`
   - Confirm Password: `Test@123`
4. **Tap Sign Up**

**Expected:**
- ✅ Shows loading state
- ✅ User created in backend (check SQLite)
- ✅ Token stored in AsyncStorage
- ✅ Navigate to Home screen automatically

### Test Login

1. **From login screen, enter:**
   - Phone: `+250789111111`
   - Password: `Test@123`
2. **Tap Login**

**Expected:**
- ✅ Shows loading state
- ✅ Token stored
- ✅ Navigate to Home screen

### Test Logout

1. **From Home screen, tap settings icon** (⚙️)
2. **Tap Logout**

**Expected:**
- ✅ Navigate back to login screen
- ✅ AsyncStorage cleared
- ✅ Attempting to access home fails

### Test Persistent Login

1. **Log in** with credentials
2. **Force close the app** (swipe up on Recent Apps)
3. **Reopen the app**

**Expected:**
- ✅ Restores token from AsyncStorage
- ✅ Shows Home screen directly (no login required)

---

## 🐛 Phase 6: Error Handling

### Test Invalid Phone Format
```
Signup with: "abc123" 
Expected: Error message "Invalid phone number"
```

### Test Weak Password
```
Signup with password: "123"
Expected: Warning "Password too weak"
```

### Test Network Disconnection

1. **Disconnect WiFi/Network**
2. **Try Login**

**Expected:** Error message about network/connection

### Test Expired Token (JWT)

1. **Wait 7+ days** (or manually set JWT_SECRET to something different)
2. **Make API request**

**Expected:** Error 401 "Token expired or invalid"

---

## 📊 Phase 7: Data Persistence Testing

### Test Backend Data Persistence

1. **Stop backend server** (Ctrl+C)
2. **Check database file exists:** `ls -la backend/sqlite.db`
3. **Start backend again:** `npm run dev`
4. **Query transactions:** `curl http://localhost:3000/api/transactions ...`

**Expected:** All previous transactions still exist

### Test Frontend Data Persistence

1. **Log out** from the app
2. **Force close app**
3. **Reopen app**

**Expected:** Shows login screen (not home), token was cleared on logout

---

## ✔️ Full Test Summary

Create this checklist to track all tests:

```markdown
## Backend Tests
- [ ] Health check endpoint responds
- [ ] Register first user successfully
- [ ] Reject duplicate phone registration
- [ ] Register second user successfully
- [ ] Login with correct password
- [ ] Reject login with wrong password
- [ ] Reject login with unknown user
- [ ] Add transaction for User 1
- [ ] Add transaction for User 2
- [ ] User 1 sees only their transactions
- [ ] User 2 sees only their transactions
- [ ] Analytics show correct totals
- [ ] Database persists after restart

## Frontend Tests
- [ ] Signup screen displays correctly
- [ ] Signup validation works
- [ ] User created in backend after signup
- [ ] Token stored in AsyncStorage
- [ ] Login screen displays correctly
- [ ] Login validation works
- [ ] Home screen displays after login
- [ ] Logout clears token
- [ ] Auto-login works after restart
- [ ] Error messages display properly
- [ ] Loading states show during API calls
- [ ] Network errors handled gracefully

## Data Isolation Tests
- [ ] User 1 cannot see User 2 transactions
- [ ] User 2 cannot see User 1 transactions
- [ ] Each user's analytics show only their data
```

---

## 🚀 Next Phase: Feature Development

Once all tests pass:

1. **Create HistoryScreen** - Display user's transactions
2. **Create SpendingScreen** - Show analytics with charts
3. **Integrate SMS Service** - Auto-parse MoMo messages
4. **Add Send Money Flow** - USSD integration
5. **Build Release APK** - Production build

See [PROJECT_STATUS.md](./PROJECT_STATUS.md) for detailed TODO list.

---

## 📞 Debugging Commands

### View Backend Logs
```bash
# All logs
grep -r "ERROR\|WARN" backend/

# Database queries
sqlite3 backend/sqlite.db ".tables"
sqlite3 backend/sqlite.db "SELECT * FROM users;"
```

### View Frontend Logs
```bash
# React Native logs
adb logcat | grep ReactNative

# Filter errors only
adb logcat *:S ReactNative:V
```

### Reset Everything
```bash
# Clear backend database
rm backend/sqlite.db

# Clear frontend cache
cd mpressClean && npm start -- --reset-cache

# Restart backend
cd backend && npm run dev
```

---

## 📝 Notes

- **Tokens expire after 7 days** - Set in `backend/src/server.ts`
- **Password hashing uses bcryptjs** - 10 salt rounds
- **SQLite stores locally** - No cloud backup currently
- **Phone number is unique** - Natural key for users
- **Per-user isolation enforced at 3 levels:**
  1. Database schema (foreign keys)
  2. API middleware (authMiddleware checks JWT phone)
  3. Frontend (user can only access their token)

---

**Last Updated:** November 13, 2025
