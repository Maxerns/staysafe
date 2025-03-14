import React, { createContext, useState, useContext, useEffect } from "react";
import { activityService } from "../services/activityService";
import { AuthContext } from "./authContext";

export const ActivityContext = createContext();

export const ActivityProvider = ({ children }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user, isSignedIn } = useContext(AuthContext);

  // Fetch activities on component mount or when user changes
  useEffect(() => {
    const fetchActivities = async () => {
      if (!isSignedIn()) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch activities for the current user
        const userActivities = await activityService.getUserActivities(
          user.info.id
        );
        setActivities(userActivities);
      } catch (err) {
        console.log("Error details:", err);
        setError(err.message || "Failed to fetch activities");
        // Initialize with empty array on error
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [user?.info?.id, isSignedIn]);

  // Add a new activity
  const addActivity = async (activityData) => {
    try {
      setLoading(true);
      // Add user ID to activity data
      const newActivity = await activityService.createActivity({
        ...activityData,
        ActivityUserID: user.info.id,
      });

      await refreshActivities();
      return true;
    } catch (err) {
      setError(err.message || "Failed to add activity");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update an activity
  const updateActivity = async (activityId, activityData) => {
    try {
      setLoading(true);
      const updatedActivity = await activityService.updateActivity(
        activityId,
        activityData
      );

      // Update the local state
      setActivities((prevActivities) =>
        prevActivities.map((activity) =>
          activity.ActivityID === activityId ? updatedActivity : activity
        )
      );

      return updatedActivity;
    } catch (err) {
      setError(err.message || "Failed to update activity");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete an activity
  const deleteActivity = async (activityId) => {
    try {
      setLoading(true);
      await activityService.deleteActivity(activityId);

      // Update the local state
      setActivities((prevActivities) =>
        prevActivities.filter((activity) => activity.ActivityID !== activityId)
      );

      return true;
    } catch (err) {
      setError(err.message || "Failed to delete activity");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Refresh activities
  const refreshActivities = async () => {
    try {
      setLoading(true);
      const userActivities = await activityService.getUserActivities(
        user.info.id
      );
      setActivities(userActivities);
    } catch (err) {
      setError(err.message || "Failed to refresh activities");
    } finally {
      setLoading(false);
    }
  };

  const createLocation = async (locationData) => {
    try {
      setLoading(true);
      const newLocation = await activityService.createLocation(locationData);
      return newLocation;
    } catch (error) {
      setError(error.message || "Failed to create location");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ActivityContext.Provider
      value={{
        activities,
        loading,
        error,
        addActivity,
        updateActivity,
        deleteActivity,
        refreshActivities,
        createLocation,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
};

// Custom hook to use the activity context
export const useActivities = () => useContext(ActivityContext);