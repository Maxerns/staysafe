import React from "react";
import { View, StyleSheet, Alert, Image, Text, ScrollView } from "react-native";
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
    <Screen style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../../../assets/StaySafeVector.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>Create Activity</Text>
          <Text style={styles.subtitle}>Plan your journey safely</Text>
        </View>
      </View>

      <ScrollView style={styles.contentContainer}>
        <View style={styles.formContainer}>
          <ActivityForm
            onSubmit={handleFormSubmit}
            onCancel={() => navigation.goBack()}
            navigation={navigation}
          />
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#f8f9fa",
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: "white",
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
    color: "#122f76",
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
    marginTop: 5,
  },
  contentContainer: {
    padding: 20,
  },
  formContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default ActivityAddScreen;
