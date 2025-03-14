import axios from 'axios';
import * as Location from 'expo-location';

const API_URL = 'https://softwarehub.uk/unibase/staysafe/v1/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const locationService = {
  // Request location permissions and get current position
  getCurrentLocation: async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Permission to access location was denied');
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        timestamp: location.timestamp,
      };
    } catch (error) {
      console.error('Error getting location:', error);
      throw error;
    }
  },

  // Update user location in the API
  updateUserLocation: async (userId, locationData) => {
    try {
      const response = await apiClient.put(`/users/${userId}`, {
        UserLatitude: locationData.latitude,
        UserLongitude: locationData.longitude,
        UserTimestamp: locationData.timestamp
      });
      return response.data;
    } catch (error) {
      console.error('Error updating user location:', error);
      throw error;
    }
  },
};

export default locationService;