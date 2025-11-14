// Backend API configuration
export const API_BASE_URL = 'http://localhost:3000';

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
  },
  TRANSACTIONS: {
    GET_ALL: '/api/transactions',
    CREATE: '/api/transactions',
    GET_BY_ID: '/api/transactions/:id',
  },
  USERS: {
    GET_PROFILE: '/api/users/profile',
    UPDATE_PROFILE: '/api/users/profile',
  },
};
