import axios from 'axios';

const API_URL = 'https://softwarehub.uk/unibase/staysafe/v1/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authService = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await apiClient.post('/users', userData);
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
      
      // Check password
      if (user.UserPassword !== credentials.password) {
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