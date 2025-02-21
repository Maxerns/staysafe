import { StyleSheet, ScrollView} from "react-native";
import ActivityItem from "./ActivityItem";

const ActivityList = ({activities, onSelect}) => {
  // Initialisations ---------------------------------
  // State -------------------------------------------
  // Handlers ----------------------------------------
  // View --------------------------------------------
  return (
    <ScrollView style={styles.container}>
      {activities.map((activity) => {
        return <ActivityItem key={activity.ActivityID} activity={activity} onSelect={onSelect} />;
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {}
});

export default ActivityList;