import { StyleSheet, Text, View, Pressable } from "react-native";

const ActivityItem = ({ activity, onSelect }) => {
  // Initialisations ---------------------------------
  // State -------------------------------------------
  // Handlers ----------------------------------------
  // View --------------------------------------------
  return (
    <Pressable onPress={() => onSelect(activity)}>
      <View style={styles.item}>
        <Text style={styles.text}>
          {activity.ActivityID} {activity.ActivityName}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  item: {
    paddingVertical: 15,
    borderTopWidth: 1,
    borderColor: "lightgrey",
  },
  text: {
    fontSize: 16,
  },
});

export default ActivityItem;
