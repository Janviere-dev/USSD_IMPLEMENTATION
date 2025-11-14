import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import sqlite3 from 'sqlite3';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import path from 'path';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_production';
const DB_PATH = path.join(__dirname, 'momo_app.db');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database initialization
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.serialize(() => {
    // Users table
    db.run(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        phone_number TEXT UNIQUE NOT NULL,
        name TEXT,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`
    );

    // Transactions table
    db.run(
      `CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        phone_number TEXT NOT NULL,
        type TEXT NOT NULL,
        amount REAL NOT NULL,
        recipient_name TEXT,
        recipient_phone TEXT,
        description TEXT,
        date DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(phone_number) REFERENCES users(phone_number) ON DELETE CASCADE
      )`
    );

    // SMS logs table
    db.run(
      `CREATE TABLE IF NOT EXISTS sms_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        phone_number TEXT NOT NULL,
        sms_text TEXT,
        processed INTEGER DEFAULT 0,
        parsed_data TEXT,
        date DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(phone_number) REFERENCES users(phone_number) ON DELETE CASCADE
      )`
    );
  });
}

// Helper functions
function generateToken(phone: string): string {
  return jwt.sign({ phone }, JWT_SECRET, { expiresIn: '7d' });
}

function verifyToken(token: string): { phone: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { phone: string };
  } catch {
    return null;
  }
}

// Middleware for authentication
function authMiddleware(req: Request, res: Response, next: Function) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  (req as any).user = decoded;
  next();
}

// ===== AUTH ENDPOINTS =====

// Register
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, phone_number, password } = req.body;

  if (!phone_number || !password) {
    return res.status(400).json({ message: 'Phone number and password are required' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run(
    `INSERT INTO users (phone_number, name, password) VALUES (?, ?, ?)`,
    [phone_number, name || '', hashedPassword],
    function (err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ message: 'Phone number already registered' });
        }
        return res.status(500).json({ message: 'Database error', error: err.message });
      }

      const token = generateToken(phone_number);
      res.status(201).json({
        user: { phone: phone_number, name: name || '' },
        token,
        message: 'User registered successfully',
      });
    }
  );
});

// Login
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.status(400).json({ message: 'Phone number and password are required' });
  }

  db.get(`SELECT * FROM users WHERE phone_number = ?`, [phone], (err, row: any) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err.message });
    }

    if (!row) {
      return res.status(401).json({ message: 'User not found' });
    }

    const passwordMatch = bcrypt.compareSync(password, row.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = generateToken(phone);
    res.json({
      user: { phone: row.phone_number, name: row.name },
      token,
      message: 'Login successful',
    });
  });
});

// ===== TRANSACTION ENDPOINTS =====

// Get all transactions for user
app.get('/api/transactions', authMiddleware, (req: Request, res: Response) => {
  const userPhone = (req as any).user.phone;

  db.all(
    `SELECT * FROM transactions WHERE phone_number = ? ORDER BY date DESC`,
    [userPhone],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err.message });
      }
      res.json({ transactions: rows || [] });
    }
  );
});

// Create transaction
app.post('/api/transactions', authMiddleware, (req: Request, res: Response) => {
  const userPhone = (req as any).user.phone;
  const { type, amount, recipient_name, recipient_phone, description } = req.body;

  if (!type || !amount) {
    return res.status(400).json({ message: 'Type and amount are required' });
  }

  db.run(
    `INSERT INTO transactions 
     (phone_number, type, amount, recipient_name, recipient_phone, description) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [userPhone, type, amount, recipient_name || '', recipient_phone || '', description || ''],
    function (err) {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err.message });
      }
      res.status(201).json({
        id: this.lastID,
        message: 'Transaction recorded successfully',
      });
    }
  );
});

// ===== SMS/SMS LOG ENDPOINTS =====

// Store SMS log
app.post('/api/sms/log', authMiddleware, (req: Request, res: Response) => {
  const userPhone = (req as any).user.phone;
  const { sms_text, parsed_data } = req.body;

  db.run(
    `INSERT INTO sms_logs (phone_number, sms_text, parsed_data) VALUES (?, ?, ?)`,
    [userPhone, sms_text, JSON.stringify(parsed_data)],
    function (err) {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err.message });
      }
      res.status(201).json({ id: this.lastID, message: 'SMS logged' });
    }
  );
});

// Get SMS logs for user
app.get('/api/sms/logs', authMiddleware, (req: Request, res: Response) => {
  const userPhone = (req as any).user.phone;

  db.all(
    `SELECT * FROM sms_logs WHERE phone_number = ? ORDER BY date DESC LIMIT 50`,
    [userPhone],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err.message });
      }
      res.json({ logs: rows || [] });
    }
  );
});

// ===== USER ENDPOINTS =====

// Get user profile
app.get('/api/users/profile', authMiddleware, (req: Request, res: Response) => {
  const userPhone = (req as any).user.phone;

  db.get(`SELECT id, phone_number, name, created_at FROM users WHERE phone_number = ?`, [userPhone], (err, row: any) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err.message });
    }
    if (!row) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user: row });
  });
});

// ===== ANALYTICS ENDPOINTS =====

// Get spending summary
app.get('/api/analytics/spending', authMiddleware, (req: Request, res: Response) => {
  const userPhone = (req as any).user.phone;

  db.all(
    `SELECT type, SUM(amount) as total FROM transactions 
     WHERE phone_number = ? GROUP BY type`,
    [userPhone],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err.message });
      }
      res.json({ spending: rows || [] });
    }
  );
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
