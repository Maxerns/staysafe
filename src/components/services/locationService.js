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
      
      // Handle case where response.data is an array instead of a single object
      const userData = Array.isArray(response.data) ? response.data[0] : response.data;
      
      if (!userData) {
        throw new Error(`No user data found for ID ${userId}`);
      }
      
      // Check if the user has valid location data
      // Note: 0,0 coordinates are considered valid (Gulf of Guinea)
      const latitude = parseFloat(userData.UserLatitude);
      const longitude = parseFloat(userData.UserLongitude);
      const timestamp = userData.UserTimestamp ? parseInt(userData.UserTimestamp) : Date.now();
      
      // Only validate that the coordinates are actual numbers
      if (isNaN(latitude) || isNaN(longitude)) {
        console.log(`Invalid coordinates for user ${userId}: lat=${latitude}, lng=${longitude}`);
        throw new Error("User has no valid location data");
      }
      
      // Check if the user has updated their location or if this is default data
      if (latitude === 0 && longitude === 0 && userData.UserTimestamp === 0) {
        console.log(`User ${userId} has default location coordinates (0,0)`);
        throw new Error("User has not updated their location yet");
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