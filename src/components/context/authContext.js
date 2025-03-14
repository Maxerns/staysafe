import React, { createContext, useState, useEffect } from "react";
import { authService } from "../services/authService";
import { locationService } from "../services/locationService";
import useStore from "../store/useStore";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const initialUserState = { isAuthenticated: false, info: null };
  const [isLoading, setIsLoading] = useState(true);
  const [user, saveUser] = useStore("user", initialUserState);
  const [locationUpdateInterval, setLocationUpdateInterval] = useState(null);

  const signIn = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      const { user: userInfo } = response;

      const userData = {
        isAuthenticated: true,
        info: userInfo,
      };

      await saveUser(userData);

      // Start tracking location after successful sign in
      startLocationTracking(userInfo.id);

      return response;
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (userData) => {
    try {
      // Store the original password before it gets hashed
      const plainPassword = userData.UserPassword;

      const response = await authService.register({
        ...userData,
        UserLatitude: 0,
        UserLongitude: 0,
        UserTimestamp: 0,
        UserImageURL:
          "https://static.generated.photos/vue-static/face-generator/landing/wall/13.jpg",
      });

      // After successful registration, use the plaintext password for login
      await signIn({
        username: userData.UserUsername,
        password: plainPassword,
      });

      return response;
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    stopLocationTracking();
    await saveUser(initialUserState);
  };

  const isSignedIn = () => {
    return user.isAuthenticated;
  };

  // Start tracking user location
  const startLocationTracking = (userId) => {
    // First get the current location immediately
    updateUserLocation(userId);

    // Then set up interval for periodic updates (every 3 minutes)
    const intervalId = setInterval(() => {
      updateUserLocation(userId);
    }, 3 * 60 * 1000); // 3 minutes

    setLocationUpdateInterval(intervalId);
  };

  // Stop tracking user location
  const stopLocationTracking = () => {
    if (locationUpdateInterval) {
      clearInterval(locationUpdateInterval);
      setLocationUpdateInterval(null);
    }
  };

  // Update user location in the API
  const updateUserLocation = async (userId) => {
    try {
      // Get current location
      const currentLocation = await locationService.getCurrentLocation();

      // Update location in API
      await locationService.updateUserLocation(userId, currentLocation);

      // Update local user state with new location
      saveUser({
        ...user,
        info: {
          ...user.info,
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          timestamp: currentLocation.timestamp,
        },
      });
    } catch (error) {
      console.error("Failed to update location:", error);
    }
  };

  // Check if user is logged in on initial load and start location tracking if needed
  useEffect(() => {
    const initialize = async () => {
      // The loading is handled automatically by useStore
      setIsLoading(false);

      // If user is already signed in, start location tracking
      if (user?.isAuthenticated && user?.info?.id) {
        startLocationTracking(user.info.id);
      }
    };

    initialize();

    // Cleanup function to stop tracking when component unmounts
    return () => {
      stopLocationTracking();
    };
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
        updateUserLocation: () =>
          user?.info?.id ? updateUserLocation(user.info.id) : null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};