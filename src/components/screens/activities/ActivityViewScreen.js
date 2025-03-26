import Screen from "../../layout/Screen";
import { useActivities } from "../../context/activityContext";
import { useState, useEffect, useContext } from "react";
import { Button, ButtonTray } from "../../UI/Button";
import {
  Alert,
  Text,
  StyleSheet,
  View,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/themeContext";
import { AuthContext } from "../../context/authContext";

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
  const { user } = useContext(AuthContext);

  // State -------------------------------------------
  const [trackingInterval, setTrackingInterval] = useState(null);
  const [locationFrom, setLocationFrom] = useState(null);
  const [locationTo, setLocationTo] = useState(null);
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [currentActivity, setCurrentActivity] = useState(activity);

  // Check if current user is the activity owner
  const isOwner = user?.info?.id === currentActivity.ActivityUserID;

  // Handlers ----------------------------------------
  const goToModifyScreen = () =>
    navigation.navigate("ActivityModifyScreen", {
      activity: currentActivity,
      onModify,
    });

  const handleStatusChange = async (newStatusId) => {
    try {
      // Prevent multiple status updates simultaneously
      if (updatingStatus) return;

      setUpdatingStatus(true);

      // Update the local state immediately for UI feedback
      setCurrentActivity((prev) => ({
        ...prev,
        ActivityStatusID: newStatusId,
      }));

      // Start or stop tracking as needed
      if (newStatusId === 2) {
        const intervalId = await startLiveLocationTracking(
          currentActivity.ActivityID
        );
        setTrackingInterval(intervalId);

        Alert.alert(
          "Journey Started",
          "Live location tracking has been activated. Your trusted contacts will be able to monitor your journey."
        );
      } else if (trackingInterval) {
        stopLiveLocationTracking(trackingInterval);
        setTrackingInterval(null);

        const statusMessages = {
          3: "Journey paused. You can resume at any time.",
          4: "Journey canceled. Location tracking has been stopped.",
          5: "Journey completed successfully! Location tracking has been stopped.",
        };

        Alert.alert(
          "Status Updated",
          statusMessages[newStatusId] || "Status updated successfully"
        );
      }

      // Call API to update in the backend
      const updatedActivity = {
        ...currentActivity,
        ActivityStatusID: newStatusId,
      };
      await updateActivity(currentActivity.ActivityID, updatedActivity);
    } catch (error) {
      console.error("Error updating activity status:", error);
      Alert.alert("Error", `Failed to update status: ${error.message}`);

      // Revert to original status if update failed
      setCurrentActivity((prev) => ({
        ...prev,
        ActivityStatusID: activity.ActivityStatusID,
      }));
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusInfo = (statusId) => {
    const statuses = {
      1: {
        label: "Planned",
        color: theme.inactive,
        icon: "calendar-outline",
        description: "This journey is scheduled but hasn't started yet.",
      },
      2: {
        label: "In Progress",
        color: theme.info,
        icon: "walk-outline",
        description:
          "You're currently on this journey with active location tracking.",
      },
      3: {
        label: "Paused",
        color: theme.warning,
        icon: "pause-outline",
        description: "This journey has been temporarily paused.",
      },
      4: {
        label: "Canceled",
        color: theme.error,
        icon: "close-circle-outline",
        description: "This journey has been canceled.",
      },
      5: {
        label: "Completed",
        color: theme.success,
        icon: "checkmark-circle-outline",
        description: "This journey has been completed successfully.",
      },
    };

    return statuses[statusId] || statuses[1];
  };

  // Fix the reference to theme in statusButtonsContainer style
  const statusButtonsContainer = {
    marginVertical: 16,
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  };

  // Modify the status buttons rendering to check ownership
  const renderStatusButtons = () => {
    // Don't show status buttons for completed or canceled activities
    if (
      currentActivity.ActivityStatusID === 4 ||
      currentActivity.ActivityStatusID === 5
    ) {
      return null;
    }

    // Only owners can change status
    if (!isOwner) {
      return null;
    }

    const statusActions = [
      { id: 2, label: "Start Journey", color: theme.success },
      { id: 3, label: "Pause", color: theme.warning },
      { id: 4, label: "Cancel", color: theme.error },
      { id: 5, label: "Complete", color: theme.info },
    ];

    return (
      <View style={statusButtonsContainer}>
        <Text style={[styles.sectionSubtitle, { color: theme.text }]}>
          Change status:
        </Text>

        <ButtonTray style={styles.buttonTray}>
          {statusActions.map((action) => (
            <Button
              key={action.id}
              label={action.label}
              styleButton={{
                backgroundColor:
                  action.id === currentActivity.ActivityStatusID
                    ? isDarkMode
                      ? "#333333"
                      : "#e0e0e0"
                    : action.color,
                paddingHorizontal: 12,
                paddingVertical: 8,
                margin: 4,
              }}
              styleLabel={{
                color:
                  action.id === currentActivity.ActivityStatusID
                    ? isDarkMode
                      ? "#999999"
                      : "#777777"
                    : theme.buttonText,
                fontSize: 14,
              }}
              onClick={() => handleStatusChange(action.id)}
              disabled={
                action.id === currentActivity.ActivityStatusID || updatingStatus
              }
            />
          ))}
        </ButtonTray>

        {updatingStatus && (
          <View style={styles.loadingStatus}>
            <ActivityIndicator size="small" color={theme.primary} />
            <Text style={[styles.loadingText, { color: theme.text }]}>
              Updating status...
            </Text>
          </View>
        )}
      </View>
    );
  };

  const goToMapScreen = (e) => {
    // Prevent any default events that might cause scrolling
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    // Clear live location tracking interval before navigating
    if (trackingInterval) {
      stopLiveLocationTracking(trackingInterval);
      setTrackingInterval(null);
    }

    // Check if we have at least basic location info
    if (currentActivity.ActivityFromID && currentActivity.ActivityToID) {
      // Navigate with proper location IDs
      navigation.navigate("ActivityMapScreen", {
        activityId: currentActivity.ActivityID,
        fromLocationId: currentActivity.ActivityFromID,
        toLocationId: currentActivity.ActivityToID,
        isViewMode: true,
        activityStatus: currentActivity.ActivityStatusID,
        userId: currentActivity.ActivityUserID,
      });
    } else {
      Alert.alert("Error", "This activity doesn't have location information");
    }
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
        Alert.alert("Error", "Failed to load location details");
      } finally {
        setIsLoadingLocations(false);
      }
    };

    fetchLocations();
  }, [currentActivity.ActivityFromID, currentActivity.ActivityToID]);

  useEffect(() => {
    if (currentActivity.ActivityStatusID === 2) {
      const initTracking = async () => {
        try {
          const intervalId = await startLiveLocationTracking(
            currentActivity.ActivityID
          );
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
  const statusInfo = getStatusInfo(currentActivity.ActivityStatusID);

  // Render the action buttons for owner or viewer
  const renderActionButtons = () => {
    // Only show action buttons to the owner
    if (!isOwner) {
      return (
        <View style={[styles.viewerNote, { backgroundColor: theme.card }]}>
          <Text style={{ color: theme.secondaryText, textAlign: 'center' }}>
            You're viewing someone else's activity. Only the owner can edit or delete it.
          </Text>
        </View>
      );
    }

    return (
      <View style={[styles.actionsContainer, { backgroundColor: theme.card }]}>
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.info }]}
            onPress={goToModifyScreen}
          >
            <Ionicons name="create-outline" size={22} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.error }]}
            onPress={() => onDelete(currentActivity.ActivityID)}
          >
            <Ionicons name="trash-outline" size={22} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Activity Header */}
        <View style={[styles.header, { backgroundColor: theme.card }]}>
          <Text style={[styles.titleText, { color: theme.text }]}>
            {currentActivity.ActivityName}
          </Text>

          {currentActivity.ActivityDescription && (
            <Text
              style={[styles.descriptionText, { color: theme.secondaryText }]}
            >
              {currentActivity.ActivityDescription}
            </Text>
          )}

          {/* Status Badge */}
          <View
            style={[styles.statusBadge, { backgroundColor: statusInfo.color }]}
          >
            <Ionicons name={statusInfo.icon} size={18} color="#FFFFFF" />
            <Text style={styles.statusText}>{statusInfo.label}</Text>
          </View>

          <Text
            style={[styles.statusDescription, { color: theme.secondaryText }]}
          >
            {statusInfo.description}
          </Text>
        </View>

        {/* Location Summary with Map Preview */}
        <TouchableOpacity
          style={[styles.mapPreviewContainer, { backgroundColor: theme.card }]}
          onPress={goToMapScreen}
          disabled={isLoadingLocations}
        >
          <View style={styles.mapInfoHeader}>
            <Ionicons name="map-outline" size={22} color={theme.primary} />
            <Text style={[styles.mapInfoTitle, { color: theme.text }]}>
              Journey Details
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.secondaryText}
            />
          </View>

          {isLoadingLocations ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={theme.primary} />
              <Text
                style={[styles.loadingText, { color: theme.secondaryText }]}
              >
                Loading location information...
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.locationRow}>
                <View
                  style={[
                    styles.locationBadge,
                    { backgroundColor: theme.info },
                  ]}
                >
                  <Text style={styles.locationBadgeText}>From</Text>
                </View>
                <Text
                  style={[styles.locationText, { color: theme.text }]}
                  numberOfLines={1}
                >
                  {locationFrom?.LocationAddress || "Starting point not set"}
                </Text>
              </View>

              <View style={styles.locationRow}>
                <View
                  style={[
                    styles.locationBadge,
                    { backgroundColor: theme.success },
                  ]}
                >
                  <Text style={styles.locationBadgeText}>To</Text>
                </View>
                <Text
                  style={[styles.locationText, { color: theme.text }]}
                  numberOfLines={1}
                >
                  {locationTo?.LocationAddress || "Destination not set"}
                </Text>
              </View>

              <Text style={[styles.tapToViewText, { color: theme.primary }]}>
                Tap to view on map
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Status Actions Section - Only for owner */}
        {renderStatusButtons()}

        {/* Activity Actions (Edit/Delete) - Only for owner */}
        {renderActionButtons()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // ...existing code...
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 16,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  descriptionText: {
    fontSize: 14,
    marginTop: 8,
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
    marginBottom: 8,
  },
  statusText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    marginLeft: 6,
  },
  statusDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  statusButtonsContainer: {
    marginVertical: 16,

    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  mapPreviewContainer: {
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  mapInfoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  mapInfoTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  locationBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 8,
  },
  locationBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  locationText: {
    flex: 1,
    fontSize: 14,
  },
  tapToViewText: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 8,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
  },
  actionsContainer: {
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginTop: 16,
  },
  actionButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 6,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    marginLeft: 6,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  buttonTray: {
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  loadingStatus: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    padding: 8,
  },
  viewerNote: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginTop: 16,
  },
});

export default ActivityViewScreen;
