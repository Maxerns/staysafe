import axios from 'axios';
import CryptoJS from 'crypto-js';

const API_URL = 'https://softwarehub.uk/unibase/staysafe/v1/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Simple password hashing function
const hashPassword = (password) => {
  return CryptoJS.SHA256(password).toString();
};

export const authService = {
  // Register a new user
  register: async (userData) => {
    try {
      // Hash the password before sending to API
      const hashedUserData = {
        ...userData,
        UserPassword: hashPassword(userData.UserPassword)
      };
      
      const response = await apiClient.post('/users', hashedUserData);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Registration failed');
      }
      throw new Error('Network error, please try again');
    }
  },

  // Login with username and password
  login: async (credentials) => {
    try {
      // Fetch all users
      const response = await apiClient.get('/users');
      const users = response.data;
      
      // Find the user with the matching username
      const user = users.find(u => u.UserUsername === credentials.username);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      // Hash the input password and check against stored hash
      const hashedPassword = hashPassword(credentials.password);
      
      if (user.UserPassword !== hashedPassword) {
        throw new Error('Invalid password');
      }
      
      // Return user data without token
      return {
        user: {
          id: user.UserID,
          firstname: user.UserFirstname,
          lastname: user.UserLastname,
          username: user.UserUsername,
        },
      };
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Login failed');
      }
      throw error;
    }
  },
};

export default authService;