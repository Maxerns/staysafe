import React, { useState, useEffect } from "react";
import {View, StyleSheet, Text, Alert } from "react-native";
import ActivityForm from "../../entity/activities/ActivityForm";
import Screen from "../../layout/Screen";
import { useActivities } from "../../context/activityContext";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { Button } from "../../UI/Button";

const ActivityAddScreen = ({ navigation, route }) => {
  // Initialisations ---------------------------------
  const { onAdd } = route.params;
  // State -------------------------------------------
  const { createLocation } = useActivities();
  const { user } = useContext(AuthContext);
  const [activityData, setActivityData] = useState(null);
  const [locations, setLocations] = useState({ pointA: null, pointB: null });
  // Handlers ----------------------------------------
  useEffect(() => {
    if (route.params?.pointA && route.params?.pointB) {
      setLocations({
        pointA: route.params.pointA,
        pointB: route.params.pointB,
      });
    }
  }, [route.params]);

  const handleSelectLocations = () => {
    navigation.navigate("MapLocationSelectionScreen", {
      pointA: locations?.pointA || null,
      pointB: locations?.pointB || null,
      onLocationsSelected: (pointA, pointB) => {
        setLocations({ pointA, pointB });
      },
    });
  };

  const handleFormSubmit = (data) => {
    // Store the activity form data.
    setActivityData(data);
    if (!locations.pointA || !locations.pointB) {
      Alert.alert("Error", "Please select both location points.");
      return;
    }
    // Create locations and then the activity
    createTask(data);
  };

  const createTask = async (data) => {
    try {
      // Create "From" location (Point A)
      const fromLocationData = {
        LocationName: locations.pointA.title || "",
        LocationDescription: locations.pointA.description || "",
        LocationAddress: locations.pointA.address || "",
        LocationPostcode: locations.pointA.postcode || "",
        LocationLatitude: locations.pointA.latitude,
        LocationLongitude: locations.pointA.longitude,
      };
      const fromResponse = await createLocation(fromLocationData);
      const fromLocationId = fromResponse[0]?.LocationID; // adjust if response is an array
  
      // Create "To" location (Point B)
      const toLocationData = {
        LocationName: locations.pointB.title || "",
        LocationDescription: locations.pointB.description || "",
        LocationAddress: locations.pointB.address || "",
        LocationPostcode: locations.pointB.postcode || "",
        LocationLatitude: locations.pointB.latitude,
        LocationLongitude: locations.pointB.longitude,
      };
      const toResponse = await createLocation(toLocationData);
      const toLocationId = toResponse[0]?.LocationID; // adjust if response is an array
  
      // Build new activity payload with all required fields
      const newActivity = {
        ActivityID: null, // New activity so ID is null
        ActivityName: data.ActivityName,
        ActivityUserID: user.info.id,
        ActivityDescription: data.ActivityDescription,
        ActivityLeave: data.ActivityLeave,
        ActivityArrive: data.ActivityArrive,
        ActivityFromID: fromLocationId,
        ActivityToID: toLocationId,
        ActivityStatusID: 1, // Default status
      };
  
      onAdd(newActivity);
    } catch (error) {
      let errorMessage = "Failed to create activity.";
      if (error.response && error.response.data) {
        errorMessage = `Error adding activity: ${
          error.response.data.message || JSON.stringify(error.response.data)
        }`;
        console.error("Error creating activity:", error.response.data);
      } else {
        errorMessage = `Error adding activity: ${error.message}`;
        console.error("Error creating activity:", error.message);
      }
      Alert.alert("Error", errorMessage);
    }
  };
  // View --------------------------------------------
  return (
    <Screen>
      <View style={styles.innerContainer}>
        <Button
          label={
            locations.pointA && locations.pointB
              ? "Change Locations"
              : "Select Locations"
          }
          onClick={handleSelectLocations}
        />
        {locations.pointA && locations.pointB && (
          <View style={styles.locationInfo}>
            <Text>Point A: {locations.pointA.address || "No address"}</Text>
            <Text>Point B: {locations.pointB.address || "No address"}</Text>
          </View>
        )}
        <ActivityForm
          onSubmit={handleFormSubmit}
          onCancel={() => navigation.goBack()}
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

export default ActivityAddScreen;
