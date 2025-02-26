import axios from 'axios';

const API_URL = '';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Set auth token for requests
const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

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
    const response = await apiClient.post('/auth/login', credentials);
    
    if (response.data && response.data.token) {
      const { token, user } = response.data;
      
      // Set the token for future requests
      setAuthToken(token);
      
        return {
          token,
          user: {
            id: user.UserID,
            firstname: user.UserFirstname,
            lastname: user.UserLastname,
            username: user.UserUsername,
          },
        };
      } else {
        throw new Error('Invalid username or password');
      }
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Login failed');
      }
      throw new Error('Network error, please try again');
    }
  },
};

export default authService;