import { Text, StyleSheet } from "react-native";
import ActivityList from "../../entity/trips/ActivityList";
import activities from "../../../data/activities";
import Screen from "../../layout/Screen";

const ActivityListScreen = () => {
  // Initialisations ---------------------------------
  // State -------------------------------------------
  // Handlers ----------------------------------------
  const goToViewScreen = (activity) => {
    console.log(`Navigating to view activity: ${activity.ActivityID}`);
  };
  // View --------------------------------------------
  return (
    <Screen>
      <Text style={styles.welcome}>Welcome Back</Text>
      <ActivityList activities={activities} onSelect={goToViewScreen} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  welcome: {
    marginTop: 24,
    marginBottom: 5,
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default ActivityListScreen;
