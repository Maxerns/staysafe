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

  // Add position for an activity
  addPosition: async (positionData) => {
    try {
      const response = await apiClient.post("/positions", positionData);
      return response.data;
    } catch (error) {
      console.error("Error adding position:", error);
      throw error;
    }
  },

  // Fetch user's live location
  getUserLocation: async (userId) => {
    try {
      console.log(`Fetching location for user ${userId} from API`);
      const response = await apiClient.get(`/users/${userId}`);
      
      // Debug the response
      console.log(`User location API response:`, response.data);
      
      // Check if the user has valid location data
      const latitude = parseFloat(response.data.UserLatitude);
      const longitude = parseFloat(response.data.UserLongitude);
      const timestamp = response.data.UserTimestamp ? parseInt(response.data.UserTimestamp) : Date.now();
      
      // Validate coordinates
      if (isNaN(latitude) || isNaN(longitude) || Math.abs(latitude) > 90 || Math.abs(longitude) > 180) {
        console.log(`Invalid coordinates for user ${userId}: lat=${latitude}, lng=${longitude}`);
        throw new Error("User has no valid location data");
      }
      
      return {
        latitude,
        longitude,
        timestamp,
      };
    } catch (error) {
      console.error(`Error fetching user ${userId} location:`, error);
      throw error;
    }
  },
};

export default locationService;