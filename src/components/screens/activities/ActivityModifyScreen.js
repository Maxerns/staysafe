import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import ActivityForm from "../../entity/activities/ActivityForm";
import Screen from "../../layout/Screen";
import { useActivities } from "../../context/activityContext";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

const ActivityModifyScreen = ({ navigation, route }) => {
  // Initialisations ---------------------------------
  const { activity, onModify } = route.params;
  // State -------------------------------------------
  const { createLocation, loadLocation } = useActivities();
  const { user } = useContext(AuthContext);
  const [locations, setLocations] = useState([null, null]);

  // Load locations on mount
  useEffect(() => {
    const loadInitialLocations = async () => {
      try {
        const fromLocation = await loadLocation(activity.ActivityFromID);
        const toLocation = await loadLocation(activity.ActivityToID);
        setLocations([fromLocation[0], toLocation[0]]);
      } catch (error) {
        Alert.alert("Error", `Failed to load locations: ${error.message}`);
        console.error("Error loading locations:", error.message);
      }
    };

    loadInitialLocations();
  }, [activity.ActivityFromID, activity.ActivityToID, loadLocation]);

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
        ActivityStatusID: 1,
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
      <View style={styles.innerContainer}>
        <ActivityForm
          originalActivity={activity}
          onSubmit={handleFormSubmit}
          onCancel={() => navigation.goBack()}
          navigation={navigation}
          initialLocations={locations}
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  innerContainer: {
    padding: 10,
  },
});

export default ActivityModifyScreen;
