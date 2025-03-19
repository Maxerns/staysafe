import { StyleSheet, ScrollView} from "react-native";
import ActivityItem from "./ActivityItem";

const ActivityList = ({ activities, onSelect }) => {
  return (
    <ScrollView style={styles.container}>
      {activities.map((activity, index) => (
        <ActivityItem
          key={activity.ActivityID || `activity-${index}`} // Fallback to index if ActivityID is missing
          activity={activity}
          onSelect={onSelect}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {}
});

export default ActivityList;