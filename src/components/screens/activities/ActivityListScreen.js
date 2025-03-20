import { useContext, useState } from "react";
import { Text, StyleSheet, View } from "react-native";
import { ButtonTray, Button } from "../../UI/Button.js";
import Icons from "../../UI/Icons.js";
import ActivityList from "../../entity/activities/ActivityList";
import Screen from "../../layout/Screen";
import useStore from "../../store/useStore.js";
import { useActivities } from "../../context/activityContext";
import { AuthContext } from "../../context/authContext.js";

const ActivityListScreen = ({ navigation }) => {
  // Initialisations ---------------------------------
  const { user } = useContext(AuthContext);
  const {
    activities,
    loading,
    error,
    addActivity,
    deleteActivity,
    updateActivity,
    refreshActivities,
  } = useActivities();
  // State -------------------------------------------
  // Handlers ----------------------------------------
  const onAdd = async (activityData) => {
    try {
      await addActivity(activityData);
      navigation.goBack();
    } catch (err) {
      console.error("Error adding activity:", err);
      // Handle error (show alert, etc.)
    }
  };

  const onDelete = async (activity) => {
    try {
      await deleteActivity(activity);
      navigation.goBack();
    } catch (err) {
      console.error("Error deleting activity:", err);
      // Handle error (show alert, etc.)
    }
  };

  const onModify = async (activityData) => {
    try {
      await updateActivity(activityData);
      navigation.goBack();
    } catch (err) {
      console.error("Error updating activity:", err);
      // Handle error (show alert, etc.)
    }
  };

  const goToViewScreen = (activity) =>
    navigation.navigate("ActivityViewScreen", { activity, onDelete, onModify });
  const goToAddScreen = () =>
    navigation.navigate("ActivityAddScreen", { onAdd });
  // View --------------------------------------------

  if (loading) {
    return (
      <Screen>
        <Text>Loading...</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <ButtonTray>
        <Text style={styles.welcome}>Welcome Back {user.info.username}</Text>
        <Button label="Add" icon={<Icons.Add />} onClick={goToAddScreen} />
      </ButtonTray>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Something went wrong. Please try again.
          </Text>
          <Button label="Retry" onClick={refreshActivities} />
        </View>
      ) : activities.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            You don't have any activities yet.
          </Text>
          <Button
            label="Add Activity"
            icon={<Icons.Add />}
            onClick={goToAddScreen}
          />
        </View>
      ) : (
        <ActivityList activities={activities} onSelect={goToViewScreen} />
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  welcome: {
    marginTop: 16,
    marginBottom: 5,
    fontSize: 24,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
});

export default ActivityListScreen;
