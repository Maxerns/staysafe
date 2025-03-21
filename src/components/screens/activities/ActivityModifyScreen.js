import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert, Image, Text, ScrollView } from "react-native";
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
            Edit Activity
          </Text>
          <Text style={[styles.subtitle, { color: theme.text }]}>
            {activity.ActivityName ||
              activity.ActivityLabel ||
              "Update journey details"}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.contentContainer}>
        <View style={[styles.formContainer, { backgroundColor: theme.card }]}>
          <ActivityForm
            originalActivity={activity}
            onSubmit={handleFormSubmit}
            onCancel={() => navigation.goBack()}
            navigation={navigation}
            initialLocations={locations}
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
  formContainer: {
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default ActivityModifyScreen;
