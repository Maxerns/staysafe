import Screen from "../../layout/Screen";
import ActivityView from "../../entity/activities/ActivityView";
import { useActivities } from "../../context/activityContext";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/authContext";
import { Button, ButtonTray } from "../../UI/Button";
import { Text, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ActivityViewScreen = ({ navigation, route }) => {
  // Initialisations ---------------------------------
  const { activity, onDelete, onModify } = route.params;
  const {
    startLiveLocationTracking,
    stopLiveLocationTracking,
    updateActivity,
    loadLocation,
  } = useActivities();
  const { user } = useContext(AuthContext);
  const isOwner = activity.ActivityUserID === user.info.id;

  // Use local state for activity to reflect changes immediately
  const [currentActivity, setCurrentActivity] = useState(activity);
  const [trackingInterval, setTrackingInterval] = useState(null);
  const [locationFrom, setLocationFrom] = useState(null);
  const [locationTo, setLocationTo] = useState(null);
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);

  // Handlers ----------------------------------------
  const goToModifyScreen = () =>
    navigation.navigate("ActivityModifyScreen", { activity: currentActivity, onModify });

  const handleStatusChange = async (newStatusId) => {
    try {
      // Create updated activity by cloning current activity and modifying status
      const updatedActivity = { ...currentActivity, ActivityStatusID: newStatusId };
      await updateActivity(currentActivity.ActivityID, updatedActivity);

      if (newStatusId === 2) {
        const intervalId = await startLiveLocationTracking(currentActivity.ActivityID);
        setTrackingInterval(intervalId);
      } else if (trackingInterval) {
        stopLiveLocationTracking(trackingInterval);
        setTrackingInterval(null);
      }

      // Update local state so changes are visible immediately
      setCurrentActivity(updatedActivity);
    } catch (error) {
      console.error("Error updating activity status:", error);
    }
  };

  const goToMapScreen = () => {
    if (isLoadingLocations) return;
    if (!locationFrom || !locationTo) return;
    navigation.navigate("ActivityMapScreen", {
      locations: [locationFrom, locationTo],
      isViewMode: true,
      activityStatus: currentActivity.ActivityStatusID,
      userId: currentActivity.ActivityUserID,
    });
  };

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setIsLoadingLocations(true);
        const fromLocation = await loadLocation(currentActivity.ActivityFromID);
        const toLocation = await loadLocation(currentActivity.ActivityToID);
        setLocationFrom(fromLocation[0]);
        setLocationTo(toLocation[0]);
      } catch (error) {
        console.error("Error loading locations:", error);
      } finally {
        setIsLoadingLocations(false);
      }
    };
    fetchLocations();
  }, [currentActivity.ActivityFromID, currentActivity.ActivityToID]);

  useEffect(() => {
    if (currentActivity.ActivityStatusID === 2 && isOwner) {
      const initTracking = async () => {
        try {
          const intervalId = await startLiveLocationTracking(currentActivity.ActivityID);
          if (intervalId) {
            setTrackingInterval(intervalId);
          }
        } catch (error) {
          console.error("Failed to start tracking:", error);
        }
      };
      initTracking();
    }
    return () => {
      if (trackingInterval) {
        stopLiveLocationTracking(trackingInterval);
      }
    };
  }, [currentActivity.ActivityStatusID]);

  // View --------------------------------------------
  return (
    <Screen>
      <ActivityView
        activity={currentActivity}
        onDelete={onDelete}
        onModify={goToModifyScreen}
        locationFrom={locationFrom}
        locationTo={locationTo}
        onViewMap={goToMapScreen}
        onStatusChange={handleStatusChange}
        isOwner={isOwner}
        isLoadingLocations={isLoadingLocations}
      />
    </Screen>
  );
};

export default ActivityViewScreen;
