import { useContext, useState } from "react"; 
import { Text, StyleSheet } from "react-native";
import { ButtonTray, Button } from "../../UI/Button.js";
import Icons from "../../UI/Icons.js";
import ActivityList from "../../entity/activities/ActivityList";
import Screen from "../../layout/Screen";
import useStore from "../../store/useStore.js";
import { useActivities } from '../../context/activityContext';
import { AuthContext } from "../../context/authContext.js";

const ActivityListScreen =  ({ navigation }) => {
  // Initialisations ---------------------------------
  // State -------------------------------------------
  const { activities, loading, error, addActivity, deleteActivity, updateActivity, refreshActivities } = useActivities();
  const { user } = useContext(AuthContext);

  // Handlers ----------------------------------------
  const onAdd = async (activityData) => {
    try {
      await addActivity(activityData);
      navigation.goBack();

    } catch (err) {
      console.error('Error adding activity:', err);
      // Handle error (show alert, etc.)
    }
  };

  const onDelete = async (activity) => {
    try {
      await deleteActivity(activity);
      navigation.goBack();
    } catch (err) {
      console.error('Error deleting activity:', err);
      // Handle error (show alert, etc.)
    }
  };

  const onModify = async (activityData) => {
    try {
      await updateActivity(activityData);
      navigation.goBack();
    } catch (err) {
      console.error('Error updating activity:', err);
      // Handle error (show alert, etc.)
    }
  };
  
  
  const goToViewScreen = (activity) => navigation.navigate('ActivityViewScreen', { activity, onDelete, onModify });
  const goToAddScreen = () => navigation.navigate('ActivityAddScreen', { onAdd });
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
      <ActivityList activities={activities} onSelect={goToViewScreen} />
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
});

export default ActivityListScreen;
