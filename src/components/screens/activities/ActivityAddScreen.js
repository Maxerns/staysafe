import React from "react";
import { View, StyleSheet, Alert } from "react-native";
import ActivityForm from "../../entity/activities/ActivityForm";
import Screen from "../../layout/Screen";
import { useActivities } from "../../context/activityContext";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

const ActivityAddScreen = ({ navigation, route }) => {
  // Initialisations ---------------------------------
  const { onAdd } = route.params;
  const { createLocation } = useActivities();
  const { user } = useContext(AuthContext);
  // State -------------------------------------------
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
        ...data,
        ActivityUserID: user.info.id,
        ActivityFromID: fromLocationId,
        ActivityToID: toLocationId,
        ActivityStatusID: 1,
      };

      onAdd(newActivity);
    } catch (error) {
      Alert.alert("Error", `Error adding activity: ${error.message}`);
      console.error("Error creating activity:", error.message);
    }
  };

  // View --------------------------------------------
  return (
    <Screen>
        <ActivityForm
          onSubmit={handleFormSubmit}
          onCancel={() => navigation.goBack()}
          navigation={navigation}
        />
    </Screen>
  );
};

const styles = StyleSheet.create({
  innerContainer: {
    padding: 10,
  },
});

export default ActivityAddScreen;