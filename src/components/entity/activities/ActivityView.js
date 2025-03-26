import { Alert, StyleSheet, Text, View } from "react-native";
import { Button, ButtonTray } from "../../UI/Button";
import Icons from "../../UI/Icons.js";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/themeContext";

const ActivityView = ({ activity, onDelete, onModify }) => {
  // Initialisations ---------------------------------
  const { user } = useContext(AuthContext);
  const { theme } = useTheme();
  const isOwner = activity.ActivityUserID === user.info.id;
  
  // Handlers ----------------------------------------
  const handleDelete = () => onDelete(activity.ActivityID);

  const requestDelete = () =>
    Alert.alert(
      "Delete Activity",
      `Are you sure that you want to delete "${activity.ActivityLabel}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: handleDelete },
      ]
    );

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " at " + 
           date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // View --------------------------------------------
  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.primary }]}>
          {activity.ActivityName || activity.ActivityLabel || "Unnamed Activity"}
        </Text>
      </View>
      
      <View style={styles.infoTray}>
        {activity.ActivityDescription && (
          <View style={styles.infoRow}>
            <Ionicons name="information-circle-outline" size={18} color={theme.text} />
            <Text style={[styles.text, { color: theme.text }]}>
              {activity.ActivityDescription}
            </Text>
          </View>
        )}
        
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={18} color={theme.text} />
          <Text style={[styles.text, { color: theme.text }]}>
            Created: {formatDate(activity.ActivityDateCreated)}
          </Text>
        </View>
        
        <View style={styles.timeContainer}>
          <View style={styles.timeRow}>
            <Ionicons name="time-outline" size={18} color={theme.info} />
            <Text style={[styles.timeLabel, { color: theme.info }]}>Departure:</Text>
            <Text style={[styles.timeValue, { color: theme.text }]}>
              {formatDate(activity.ActivityLeave)}
            </Text>
          </View>
          
          <View style={styles.timeRow}>
            <Ionicons name="flag-outline" size={18} color={theme.success} />
            <Text style={[styles.timeLabel, { color: theme.success }]}>Arrival:</Text>
            <Text style={[styles.timeValue, { color: theme.text }]}>
              {formatDate(activity.ActivityArrive)}
            </Text>
          </View>
        </View>
      </View>
      
      {isOwner && (
        <ButtonTray style={styles.buttonTray}>
          <Button 
            icon={<Icons.Edit />} 
            label="Modify" 
            styleButton={{ backgroundColor: theme.info }}
            styleLabel={{ color: theme.buttonText }}
            onClick={onModify} 
          />
          <Button
            icon={<Icons.Delete />}
            label="Delete"
            styleButton={{ backgroundColor: theme.error }}
            styleLabel={{ color: theme.buttonText }}
            onClick={requestDelete}
          />
        </ButtonTray>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginBottom: 15,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  infoTray: {
    gap: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  text: {
    fontSize: 15,
    flex: 1,
  },
  timeContainer: {
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  timeLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 8,
    width: 80,
  },
  timeValue: {
    fontSize: 14,
    flex: 1,
  },
  buttonTray: {
    marginTop: 16,
    justifyContent: "flex-end",
  },
});

export default ActivityView;
