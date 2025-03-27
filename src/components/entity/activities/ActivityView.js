import { Alert, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { Button, ButtonTray } from "../../UI/Button";
import Icons from "../../UI/Icons.js";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/themeContext";

const ActivityView = ({
  activity,
  onDelete,
  onModify,
  locationFrom,
  locationTo,
  onViewMap,
  onStatusChange,
  isOwner,
  isLoadingLocations,
}) => {
  const { user } = useContext(AuthContext);
  const { theme } = useTheme();

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " at " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const renderStatusButtons = () => {
    if (!isOwner) return null;
    const statusActions = [
      { id: 2, label: "Start", color: "green", icon: "play-outline" },
      { id: 3, label: "Pause", color: "orange", icon: "pause-outline" },
      { id: 4, label: "Cancel", color: "red", icon: "close-circle-outline" },
      { id: 5, label: "Complete", color: "blue", icon: "checkmark-done-outline" },
    ];
    return statusActions.map((action) => (
      <Button
        key={action.id}
        icon={<Ionicons name={action.icon} size={20} color="white" />}
        styleButton={{
          backgroundColor: action.id === activity.ActivityStatusID ? "lightgrey" : action.color,
        }}
        onClick={() => onStatusChange(action.id)}
        disabled={action.id === activity.ActivityStatusID}
      />
    ));
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      <View style={styles.detailsContainer}>
        <Text style={[styles.title, { color: theme.primary }]}>
          {activity.ActivityName || activity.ActivityLabel || "Unnamed Activity"}
        </Text>
        {activity.ActivityDescription && (
          <Text style={[styles.description, { color: theme.text }]}>
            {activity.ActivityDescription}
          </Text>
        )}
      </View>

      <View style={styles.scheduleContainer}>
        {isLoadingLocations ? (
          <ActivityIndicator size="small" color={theme.primary} />
        ) : (
          <>
            <View style={styles.scheduleBlock}>
              <Ionicons name="log-out-outline" size={20} color={theme.info} />
              <Text style={[styles.scheduleLabel, { color: theme.primary }]}>{locationFrom?.LocationName || "N/A"}</Text>
              <Text style={[styles.scheduleTime, { color: theme.text }]}>
                {formatDate(activity.ActivityLeave)}
              </Text>
            </View>
            <View style={styles.scheduleBlock}>
              <Ionicons name="flag-outline" size={20} color={theme.success} />
              <Text style={[styles.scheduleLabel, { color: theme.primary }]}>{locationTo?.LocationName || "N/A"}</Text>
              <Text style={[styles.scheduleTime, { color: theme.text }]}>
                {formatDate(activity.ActivityArrive)}
              </Text>
            </View>
          </>
        )}
      </View>

      {isOwner ? (
        <>
          <View style={styles.buttonRow}>
            <Button
              label="View Map"
              icon={<Ionicons name="map-outline" size={16} color="white" />}
              styleButton={{ backgroundColor: "dodgerblue" }}
              onClick={onViewMap}
            />
          </View>
          <View style={styles.buttonRow}>
            {renderStatusButtons()}
          </View>
          <View style={styles.buttonRow}>
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
              onClick={() =>
                Alert.alert(
                  "Delete Activity",
                  `Are you sure that you want to delete "${activity.ActivityLabel}"?`,
                  [
                    { text: "Cancel", style: "cancel" },
                    { text: "Delete", style: "destructive", onPress: () => onDelete(activity.ActivityID) },
                  ]
                )
              }
            />
          </View>
        </>
      ) : (
        <ButtonTray style={styles.buttonTray}>
          <Button
            label="View Activity"
            icon={<Ionicons name="eye-outline" size={16} color="white" />}
            styleButton={{ backgroundColor: "dodgerblue" }}
            onClick={onViewMap}
          />
        </ButtonTray>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    margin: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  detailsContainer: {
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  description: {
    fontSize: 16,
    marginTop: 6,
  },
  scheduleContainer: {
    flexDirection: "column", // changed from "row" to "column"
    marginBottom: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  scheduleBlock: {
    marginBottom: 10, // added spacing between rows
  },
  scheduleLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 4,
  },
  scheduleLocation: {
    fontSize: 14,
    marginTop: 2,
  },
  scheduleTime: {
    fontSize: 14,
    marginTop: 2,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 8,
  },
  buttonTray: {
    flexDirection: "column",
    flexWrap: "nowrap",
    justifyContent: "center",
    gap: 8,
  },
});

export default ActivityView;
