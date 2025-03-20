import { Alert, StyleSheet, Text, View } from "react-native";
import { Button, ButtonTray } from "../../UI/Button";
import Icons from "../../UI/Icons.js";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

const ActivityView = ({ activity, onDelete, onModify }) => {
  // Initialisations ---------------------------------
  const { user } = useContext(AuthContext); // Get the current logged-in user
  const isOwner = activity.ActivityUserID === user.info.id; // Check ownership
  // State -------------------------------------------
  // Handlers ----------------------------------------

  const handleDelete = () => onDelete(activity.ActivityID);

  const requestDelete = () =>
    Alert.alert(
      "Delete Activity",
      `Are you sure that you want to delete activity "${activity.ActivityLabel}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: handleDelete },
      ]
    );

  // View --------------------------------------------
  return (
    <View style={styles.container}>
      <View style={styles.infoTray}>
        <Text style={styles.boldText}>Label: {activity.ActivityLabel}</Text>
        <Text style={styles.text}>Activity ID: {activity.ActivityID}</Text>
        <Text style={styles.text}>User ID: {activity.ActivityUserID}</Text>
        <Text style={styles.text}>
          Activity Reference ID: {activity.ActivityReferenceID}
        </Text>
        <Text style={styles.text}>
          Created: {new Date(activity.ActivityDateCreated).toLocaleString()}
        </Text>
      </View>
      {isOwner && ( // Only show buttons if the user is the owner
        <ButtonTray>
          <Button icon={<Icons.Edit />} label="Modify" onClick={onModify} />
          <Button
            icon={<Icons.Delete />}
            label="Delete"
            styleButton={{ backgroundColor: "mistyrose" }}
            styleLabel={{ color: "red" }}
            onClick={requestDelete}
          />
        </ButtonTray>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 15,
  },
  infoTray: {
    gap: 5,
  },
  boldText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  text: {
    fontSize: 16,
  },
});

export default ActivityView;
