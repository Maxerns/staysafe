import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import useStore from '../store/useStore';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const initialUserState = { isAuthenticated: false, info: null };
  const [isLoading, setIsLoading] = useState(true);
  const [user, saveUser] = useStore('user', initialUserState);

  const signIn = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      const { user: userInfo } = response;
      
      const userData = {
        isAuthenticated: true,
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
      const response = await authService.register({
        ...userData,
        UserLatitude: 0,
        UserLongitude: 0,
        UserTimestamp: 0,
        UserImageURL: 'https://static.generated.photos/vue-static/face-generator/landing/wall/13.jpg',
      });
      
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
    return user.isAuthenticated;
  };

  // Check if user is logged in on initial load
  useEffect(() => {
    // The loading is handled automatically by useStore
    setIsLoading(false);
  }, []);

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