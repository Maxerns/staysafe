import { useContext, useState } from "react"; 
import { Text, StyleSheet } from "react-native";
import { ButtonTray, Button } from "../../UI/Button.js";
import Icons from "../../UI/Icons.js";
import ActivityList from "../../entity/activities/ActivityList";
import intialActivities from "../../../data/activities.js";
import Screen from "../../layout/Screen";
import useStore from "../../store/useStore.js";
import { AuthContext } from "../../context/authContext.js";

const ActivityListScreen =  ({ navigation }) => {
  // Initialisations ---------------------------------
  // State -------------------------------------------
  const [activities, setActivities] = useState(intialActivities);
  const { user } = useContext(AuthContext);

  // Handlers ----------------------------------------
  const goToViewScreen = (activity) => {
    console.log(`Navigating to view activity: ${activity.ActivityID}`);
  };

  const handleAdd = (activity) => setActivities([...activities, activity]);

  const onAdd = (activity) => {
    handleAdd(activity);
    navigation.goBack();
  };
  
  const goToAddScreen = () => navigation.navigate('ActivityAddScreen', { onAdd });
  // View --------------------------------------------
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
