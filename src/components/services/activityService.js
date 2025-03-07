import axios from "axios";

const API_URL = "https://softwarehub.uk/unibase/staysafe/v1/api";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const activityService = {
  // Get all activities
  getActivities: async () => {
    try {
      const response = await apiClient.get("/activities");
      return response.data;
    } catch (error) {
      console.error("Error fetching activities:", error);
      throw error;
    }
  },

  // Get activities by user ID
  getUserActivities: async (userId) => {
    try {
      const response = await apiClient.get(`/activities/users/${userId}`);
      return response.data;
    } catch (error) {
        return response.data;
    }
  },

  // Get activity by ID
  getActivity: async (activityId) => {
    try {
      const response = await apiClient.get(`/activities/${activityId}`);
      return response.data;
    } catch (error) {
      return response.data;
    }
  },

  // Create new activity
  createActivity: async (activityData) => {
    try {
      const response = await apiClient.post("/activities/", activityData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        console.error("Error creating activity:", error.response.data.message);
      } else {
        console.error("Error creating activity:", error.message);
      }
      throw error;
    }
  },

  // Update activity
  updateActivity: async (activityId, activityData) => {
    try {
      const response = await apiClient.put(
        `/activities/${activityId}`,
        activityData
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating activity ${activityId}:`, error);
      throw error;
    }
  },

  // Delete activity
  deleteActivity: async (activityId) => {
    try {
      const response = await apiClient.delete(`/activities/${activityId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting activity ${activityId}:`, error);
      throw error;
    }
  },
};

export default activityService;
