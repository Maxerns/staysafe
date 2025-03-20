import Screen from "../../layout/Screen";
import ActivityView from "../../entity/activities/ActivityView";
import { useActivities } from "../../context/activityContext";
import { useState, useEffect } from "react";
import { Button, ButtonTray } from "../../UI/Button";
import { Alert, Text, StyleSheet, View } from "react-native";
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
  // State -------------------------------------------
  const [trackingInterval, setTrackingInterval] = useState(null);
  const [locationFrom, setLocationFrom] = useState(null);
  const [locationTo, setLocationTo] = useState(null);
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);
  // Handlers ----------------------------------------
  const goToModifyScreen = () =>
    navigation.navigate("ActivityModifyScreen", { activity, onModify });

  const handleStatusChange = async (newStatusId) => {
    try {
      const updatedActivity = {
        ...activity,
        ActivityStatusID: newStatusId,
      };

      await updateActivity(activity.ActivityID, updatedActivity);

      if (newStatusId === 2) {
        console.log(
          "Starting live tracking for activity:",
          activity.ActivityID
        );
        const intervalId = await startLiveLocationTracking(activity.ActivityID);
        console.log("Tracking interval created:", intervalId);
        setTrackingInterval(intervalId);

        // Update the local activity state to reflect the new status
        activity.ActivityStatusID = 2;
      } else if (trackingInterval) {
        console.log("Stopping tracking interval:", trackingInterval);
        stopLiveLocationTracking(trackingInterval);
        setTrackingInterval(null);
      }

      Alert.alert("Success", `Activity status updated to ${newStatusId}`);
    } catch (error) {
      console.error("Error updating activity status:", error);
      Alert.alert("Error", `Failed to update status: ${error.message}`);
    }
  };

  const renderStatusButtons = () => {
    const statusActions = [
      { id: 2, label: "Start", color: "green" },
      { id: 3, label: "Pause", color: "orange" },
      { id: 4, label: "Cancel", color: "red" },
      { id: 5, label: "Complete", color: "blue" },
    ];

    return statusActions.map((action) => (
      <Button
        key={action.id}
        label={action.label}
        styleButton={{
          backgroundColor:
            action.id === activity.ActivityStatusID
              ? "lightgrey"
              : action.color,
        }}
        styleLabel={{
          color: action.id === activity.ActivityStatusID ? "darkgrey" : "white",
        }}
        onClick={() => handleStatusChange(action.id)}
        disabled={action.id === activity.ActivityStatusID}
      />
    ));
  };

  const goToMapScreen = () => {
    if (isLoadingLocations) {
      Alert.alert("Loading", "Please wait while locations are being loaded");
      return;
    }

    if (!locationFrom || !locationTo) {
      Alert.alert("Error", "Location data not available");
      return;
    }

    navigation.navigate("ActivityMapScreen", {
      locations: [locationFrom, locationTo],
      isViewMode: true,
      activityStatus: activity.ActivityStatusID, // Fixed typo here (was ActvityStatusID)
      userId: activity.ActivityUserID,
    });
  };

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setIsLoadingLocations(true);
        const fromLocation = await loadLocation(activity.ActivityFromID);
        const toLocation = await loadLocation(activity.ActivityToID);

        setLocationFrom(fromLocation[0]);
        setLocationTo(toLocation[0]);
      } catch (error) {
        console.error("Error loading locations:", error);
        Alert.alert("Error", "Failed to load location details");
      } finally {
        setIsLoadingLocations(false);
      }
    };

    fetchLocations();
  }, [activity.ActivityFromID, activity.ActivityToID]);

  useEffect(() => {
    console.log("Current activity status:", activity.ActivityStatusID);

    if (activity.ActivityStatusID === 2) {
      console.log(
        "Starting tracking on initial load for activity:",
        activity.ActivityID
      );
      const initTracking = async () => {
        try {
          const intervalId = await startLiveLocationTracking(
            activity.ActivityID
          );
          console.log("Tracking started with interval:", intervalId);
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
        console.log("Cleaning up tracking interval:", trackingInterval);
        stopLiveLocationTracking(trackingInterval);
      }
    };
  }, [activity.ActivityStatusID]);

  // View --------------------------------------------
  return (
    <Screen>
      <ActivityView
        activity={activity}
        onDelete={onDelete}
        onModify={goToModifyScreen}
      />

      {isLoadingLocations ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading location details...</Text>
        </View>
      ) : (
        <View style={styles.locationsContainer}>
          <Text style={styles.locationTitle}>
            From: {locationFrom?.LocationName || "N/A"}
          </Text>
          <Text style={styles.locationAddress}>
            {locationFrom?.LocationAddress || "No address"}
          </Text>

          <Text style={styles.locationTitle}>
            To: {locationTo?.LocationName || "N/A"}
          </Text>
          <Text style={styles.locationAddress}>
            {locationTo?.LocationAddress || "No address"}
          </Text>
        </View>
      )}

      <ButtonTray>
        {renderStatusButtons()}
        <Button
          label="View Map"
          icon={<Ionicons name="map-outline" size={16} color="white" />}
          styleButton={{ backgroundColor: "dodgerblue" }}
          onClick={goToMapScreen}
        />
      </ButtonTray>
    </Screen>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    marginVertical: 10,
  },
  loadingText: {
    textAlign: "center",
    color: "#6c757d",
  },
  locationsContainer: {
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    marginVertical: 10,
  },
  locationTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 8,
    marginBottom: 4,
  },
  locationAddress: {
    color: "#6c757d",
    marginBottom: 8,
  },
});

export default ActivityViewScreen;
