import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Image,
  Text,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import ActivityForm from "../../entity/activities/ActivityForm";
import Screen from "../../layout/Screen";
import { useActivities } from "../../context/activityContext";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { useTheme } from "../../context/themeContext";

const ActivityModifyScreen = ({ navigation, route }) => {
  // Initialisations ---------------------------------
  const { activity, onModify } = route.params;
  const { createLocation, loadLocation } = useActivities();
  const { user } = useContext(AuthContext);
  const { theme } = useTheme();

  // State -------------------------------------------
  const [locations, setLocations] = useState([null, null]);
  const [isLoading, setIsLoading] = useState(false);
  const locationsLoadedRef = useRef(false);

  // Load locations on mount
  useEffect(() => {
    // Only load locations if we haven't already and we have valid IDs
    if (
      !locationsLoadedRef.current &&
      activity.ActivityFromID &&
      activity.ActivityToID &&
      !isLoading
    ) {
      const loadInitialLocations = async () => {
        try {
          setIsLoading(true);

          const fromLocation = await loadLocation(activity.ActivityFromID);
          const toLocation = await loadLocation(activity.ActivityToID);

          if (fromLocation && fromLocation[0] && toLocation && toLocation[0]) {
            setLocations([fromLocation[0], toLocation[0]]);
            // Mark as loaded to prevent future loads
            locationsLoadedRef.current = true;
          }
        } catch (error) {
          Alert.alert("Error", `Failed to load locations: ${error.message}`);
          console.error("Error loading locations:", error);
        } finally {
          setIsLoading(false);
        }
      };

      loadInitialLocations();
    }
    // Removed console.log to reduce unnecessary operations
    // IMPORTANT: Only depend on the IDs, not any objects that might change frequently
  }, [activity.ActivityFromID, activity.ActivityToID]);

  // Handlers ----------------------------------------
  const handleFormSubmit = async (data) => {
    try {
      if (!data.locations[0] || !data.locations[1]) {
        Alert.alert("Error", "Please select both location points.");
        return;
      }

      const locationResponses = await Promise.all(
        data.locations.map((location) => createLocation(location))
      );

      const fromLocationId = locationResponses[0][0]?.LocationID;
      const toLocationId = locationResponses[1][0]?.LocationID;

      const newActivity = {
        ...activity,
        ...data,
        ActivityUserID: user.info.id,
        ActivityFromID: fromLocationId,
        ActivityToID: toLocationId,
        ActivityStatusID: activity.ActivityStatusID,
      };

      onModify(newActivity);
    } catch (error) {
      Alert.alert("Error", `Error adding activity: ${error.message}`);
      console.error("Error creating activity:", error.message);
    }
  };

  // View --------------------------------------------
  return (
    <Screen>
      {isLoading ? (
        <View
          style={[styles.loadingContainer, { backgroundColor: theme.card }]}
        >
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.text }]}>
            Loading activity data...
          </Text>
        </View>
      ) : (
          <ActivityForm
            originalActivity={activity}
            onSubmit={handleFormSubmit}
            onCancel={() => navigation.goBack()}
            navigation={navigation}
            initialLocations={locations}
          />
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  loadingContainer: {
    borderRadius: 12,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    height: 200,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
  },
});

export default ActivityModifyScreen;
