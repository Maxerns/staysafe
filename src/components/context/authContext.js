import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import useStore from '../store/useStore';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const initialUserState = { token: null, info: null };
  const [isLoading, setIsLoading] = useState(true);
  const [user, saveUser] = useStore('user', initialUserState);

  const signIn = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      const { token, user: userInfo } = response;
      
      const userData = {
        token,
        info: userInfo
      };
      
      await saveUser(userData);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (userData) => {
    try {
      const response = await authService.register(userData);
      
      // After successful registration, automatically log in
      await signIn({
        username: userData.UserUsername,
        password: userData.password,
      });
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    await saveUser(initialUserState);
  };

  const isSignedIn = () => {
    return !!user.token;
  };

  // Check if user is logged in on initial load
  useEffect(() => {
    // The loading is handled automatically by useStore
    setIsLoading(false);
  }, []);

  // Set auth token for API requests whenever user changes
  useEffect(() => {
    if (user.token) {
      authService.setAuthToken(user.token);
    } else {
      authService.setAuthToken(null);
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signUp,
        signOut,
        isSignedIn,
        user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};