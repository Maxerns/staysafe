import React, { createContext, useState, useContext, useEffect } from "react";
import { activityService } from "../services/activityService";
import { ContactContext } from "./contactContext";
import { AuthContext } from "./authContext";
import { locationService } from "../services/locationService";

export const ActivityContext = createContext();

export const ActivityProvider = ({ children }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { contacts } = useContext(ContactContext);
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

        // Fetch activities for the current user and their contacts in parallel
        const [userActivities, contactsActivities] = await Promise.all([
          activityService.getUserActivities(user.info.id),
          Promise.all(
            contacts.map((contact) =>
              activityService.getUserActivities(contact.ContactContactID)
            )
          ),
        ]);

        // Merge user activities and contacts activities into a single array
        setActivities([...userActivities, ...contactsActivities.flat()]);
      } catch (err) {
        console.error("Error fetching activities:", err);
        setError(err.message || "Failed to fetch activities");
        setActivities([]); // Initialize with empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [user?.info?.id, isSignedIn, contacts]);

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
      // Make the API call but don't depend on its result for local state update
      await activityService.updateActivity(activityId, activityData);

      // Update local state immediately to avoid delay
      setActivities((prevActivities) =>
        prevActivities.map((activity) =>
          activity.ActivityID === activityId
            ? { ...activity, ...activityData }
            : activity
        )
      );

      return activityData; // Return the data we used to update rather than waiting for API response
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
      // Fetch activities for the current user and their contacts in parallel
      const [userActivities, contactsActivities] = await Promise.all([
        activityService.getUserActivities(user.info.id),
        Promise.all(
          contacts.map((contact) =>
            activityService.getUserActivities(contact.ContactContactID)
          )
        ),
      ]);

      // Merge user activities and contacts activities into a single array
      setActivities([...userActivities, ...contactsActivities.flat()]);
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

  const loadLocation = async (locationId) => {
    try {
      setLoading(true);

      if (!locationId) {
        throw new Error("Location ID is required");
      }

      const location = await activityService.getLocation(locationId);

      // Log the response to help with debugging
      console.log(`Location ${locationId} data:`, location);

      return location;
    } catch (error) {
      console.error(`Error loading location ${locationId}:`, error);
      setError(error.message || "Failed to load location");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const startLiveLocationTracking = async (activityId) => {
    try {
      console.log("Starting live location tracking for activity:", activityId);

      // Update location immediately
      await updateLocationOnce(activityId);

      // Start periodic updates every 15 seconds
      const intervalId = setInterval(
        () => updateLocationOnce(activityId),
        15000
      );
      console.log("Created interval for tracking:", intervalId);
      return intervalId; // Return interval ID to stop tracking later
    } catch (error) {
      console.error("Error starting live location tracking:", error);
      return null;
    }
  };

  const updateLocationOnce = async (activityId) => {
    try {
      console.log("Updating location for activity:", activityId);
      const location = await locationService.getCurrentLocation();
      console.log("Current location:", location);

      await locationService.updateUserLocation(user.info.id, location);

      await locationService.addPosition({
        PositionActivityID: activityId,
        PositionLatitude: location.latitude,
        PositionLongitude: location.longitude,
        PositionTimestamp: location.timestamp,
      });

      console.log("Location updated successfully");
      return true;
    } catch (error) {
      console.error("Error updating location:", error);
      return false;
    }
  };

  const stopLiveLocationTracking = (intervalId) => {
    if (intervalId) {
      console.log("Stopping tracking interval:", intervalId);
      clearInterval(intervalId);
    }

    // Ensure no further updates occur
    setLoading(false);
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
        loadLocation,
        startLiveLocationTracking,
        stopLiveLocationTracking,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
};

// Custom hook to use the activity context
export const useActivities = () => useContext(ActivityContext);
