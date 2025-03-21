import Screen from "../../layout/Screen";
import ActivityView from "../../entity/activities/ActivityView";
import { useActivities } from "../../context/activityContext";
import { useState, useEffect } from "react";
import { Button, ButtonTray } from "../../UI/Button";
import { Alert, Text, StyleSheet, View, Image, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/themeContext";

const ActivityViewScreen = ({ navigation, route }) => {
  // Initialisations ---------------------------------
  const { activity, onDelete, onModify } = route.params;
  const {
    startLiveLocationTracking,
    stopLiveLocationTracking,
    updateActivity,
    loadLocation,
  } = useActivities();
  const { theme, isDarkMode } = useTheme();

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
      { id: 2, label: "Start", color: theme.success },
      { id: 3, label: "Pause", color: theme.warning },
      { id: 4, label: "Cancel", color: theme.error },
      { id: 5, label: "Complete", color: theme.info },
    ];

    return statusActions.map((action) => (
      <Button
        key={action.id}
        label={action.label}
        styleButton={{
          backgroundColor:
            action.id === activity.ActivityStatusID
              ? isDarkMode
                ? "#333333"
                : "#e0e0e0"
              : action.color,
          paddingHorizontal: 8,
          paddingVertical: 6,
          minWidth: 70,
          margin: 2,
        }}
        styleLabel={{
          color:
            action.id === activity.ActivityStatusID
              ? isDarkMode
                ? "#999999"
                : "#777777"
              : theme.buttonText,
          fontSize: 11,
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
      activityStatus: activity.ActivityStatusID,
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
    <Screen style={[styles.screen, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.card }]}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../../../assets/StaySafeVector.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.headerTextContainer}>
          <Text style={[styles.title, { color: theme.primary }]}>
            Activity Details
          </Text>
          <Text style={[styles.subtitle, { color: theme.text }]}>
            {activity.ActivityName ||
              activity.ActivityLabel ||
              "Unnamed Activity"}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.contentContainer}>
        <ActivityView
          activity={activity}
          onDelete={onDelete}
          onModify={goToModifyScreen}
        />

        {isLoadingLocations ? (
          <View
            style={[styles.loadingContainer, { backgroundColor: theme.card }]}
          >
            <Text style={[styles.loadingText, { color: theme.text }]}>
              Loading location details...
            </Text>
          </View>
        ) : (
          <View
            style={[styles.locationsContainer, { backgroundColor: theme.card }]}
          >
            <Text style={[styles.locationTitle, { color: theme.primary }]}>
              From: {locationFrom?.LocationName || "N/A"}
            </Text>
            <Text style={[styles.locationAddress, { color: theme.text }]}>
              {locationFrom?.LocationAddress || "No address"}
            </Text>

            <Text style={[styles.locationTitle, { color: theme.primary }]}>
              To: {locationTo?.LocationName || "N/A"}
            </Text>
            <Text style={[styles.locationAddress, { color: theme.text }]}>
              {locationTo?.LocationAddress || "No address"}
            </Text>
          </View>
        )}

        <View style={[styles.statusContainer, { backgroundColor: theme.card }]}>
          <Text style={[styles.statusTitle, { color: theme.primary }]}>
            Activity Status
          </Text>
          <ButtonTray style={styles.buttonTray}>
            {renderStatusButtons()}
          </ButtonTray>

          <Button
            label="View Map"
            icon={
              <Ionicons name="map-outline" size={16} color={theme.buttonText} />
            }
            styleButton={[styles.mapButton, { backgroundColor: theme.primary }]}
            onClick={goToMapScreen}
          />
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  logo: {
    width: 120,
    height: 60,
  },
  headerTextContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    marginTop: 5,
    textAlign: "center",
  },
  contentContainer: {
    padding: 20,
  },
  loadingContainer: {
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  loadingText: {
    textAlign: "center",
  },
  locationsContainer: {
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  locationTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 8,
    marginBottom: 4,
  },
  locationAddress: {
    marginBottom: 8,
  },
  statusContainer: {
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  buttonTray: {
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  mapButton: {
    marginTop: 15,
  },
});

export default ActivityViewScreen;
