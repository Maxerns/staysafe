import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  const signIn = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      const { token, user } = response;
      
      setUserToken(token);
      setUserInfo(user);
      
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userInfo', JSON.stringify(user));
      
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
    setUserToken(null);
    setUserInfo(null);
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userInfo');
  };

  const isSignedIn = () => {
    return !!userToken;
  };

  // Check if user is already logged in
  const bootstrapAsync = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userInfoString = await AsyncStorage.getItem('userInfo');
      
      if (token && userInfoString) {
        setUserToken(token);
        setUserInfo(JSON.parse(userInfoString));
      }
    } catch (error) {
      console.log('Error restoring token', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    bootstrapAsync();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signUp,
        signOut,
        isSignedIn,
        userToken,
        userInfo,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};