import { Alert, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { Button, ButtonTray } from "../../UI/Button";
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

  // Get status information
  const getStatusInfo = () => {
    switch (activity.ActivityStatusID) {
      case 1:
        return {
          text: "Planned",
          color: theme.inactive,
          icon: "calendar-outline",
        };
      case 2:
        return { text: "In Progress", color: theme.info, icon: "walk-outline" };
      case 3:
        return { text: "Paused", color: theme.warning, icon: "pause-outline" };
      case 4:
        return {
          text: "Cancelled",
          color: theme.error,
          icon: "close-circle-outline",
        };
      case 5:
        return {
          text: "Completed",
          color: theme.success,
          icon: "checkmark-circle-outline",
        };
      default:
        return {
          text: "Unknown",
          color: theme.inactive,
          icon: "help-circle-outline",
        };
    }
  };

  const statusInfo = getStatusInfo();

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " · " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const renderStatusButtons = () => {
    if (!isOwner) return null;
    const statusActions = [
      { id: 2, label: "Start", color: theme.info, icon: "play-outline" },
      { id: 3, label: "Pause", color: theme.warning, icon: "pause-outline" },
      { id: 4, label: "Cancel", color: theme.error, icon: "close-circle-outline" },
      { id: 5, label: "Complete", color: theme.success, icon: "checkmark-done-outline" },
    ];
    
    return (
      <View style={styles.statusButtons}>
        <Text style={[styles.sectionTitle, { color: theme.inactive }]}>Change Status</Text>
        <View style={styles.buttonsRow}>
          {statusActions.map((action) => (
            <Button
              key={action.id}
              icon={<Ionicons name={action.icon} size={18} color="white" />}
              styleButton={{
                backgroundColor: action.id === activity.ActivityStatusID ? `${action.color}50` : action.color,
                flex: 1,
                paddingVertical: 8,
              }}
              onClick={() => onStatusChange(action.id)}
              disabled={action.id === activity.ActivityStatusID}
            />
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      {/* Status badge at top */}
      <View style={styles.headerRow}>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: `${statusInfo.color}20` },
          ]}
        >
          <Ionicons
            name={statusInfo.icon}
            size={16}
            color={statusInfo.color}
          />
          <Text style={[styles.statusText, { color: statusInfo.color }]}>
            {statusInfo.text}
          </Text>
        </View>
        
        {!isOwner && (
          <View style={[styles.ownerBadge, { backgroundColor: theme.info }]}>
            <Ionicons name="person" size={14} color="white" />
            <Text style={styles.ownerText}>
              {activity.ActivityUsername}
            </Text>
          </View>
        )}
      </View>

      <Text style={[styles.title, { color: theme.primary }]}>
        {activity.ActivityName || activity.ActivityLabel || "Unnamed Activity"}
      </Text>
      
      {activity.ActivityDescription && (
        <Text style={[styles.description, { color: theme.text }]}>
          {activity.ActivityDescription}
        </Text>
      )}

      <View style={[styles.scheduleContainer, { borderColor: theme.border }]}>
        {isLoadingLocations ? (
          <ActivityIndicator size="small" color={theme.primary} />
        ) : (
          <>
            <View style={styles.scheduleBlock}>
              <View style={styles.scheduleHeader}>
                <Ionicons name="log-out-outline" size={20} color={theme.info} />
                <Text style={[styles.scheduleTitle, { color: theme.primary }]}>Departure</Text>
              </View>
              <Text style={[styles.scheduleLabel, { color: theme.text }]}>
                {locationFrom?.LocationName || "Location not specified"}
              </Text>
              <Text style={[styles.scheduleTime, { color: theme.inactive }]}>
                {formatDate(activity.ActivityLeave)}
              </Text>
            </View>
            
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            
            <View style={styles.scheduleBlock}>
              <View style={styles.scheduleHeader}>
                <Ionicons name="flag-outline" size={20} color={theme.success} />
                <Text style={[styles.scheduleTitle, { color: theme.primary }]}>Arrival</Text>
              </View>
              <Text style={[styles.scheduleLabel, { color: theme.text }]}>
                {locationTo?.LocationName || "Location not specified"}
              </Text>
              <Text style={[styles.scheduleTime, { color: theme.inactive }]}>
                {formatDate(activity.ActivityArrive)}
              </Text>
            </View>
          </>
        )}
      </View>

      <Button
        label="View Map"
        icon={<Ionicons name="map-outline" size={16} color="white" />}
        styleButton={{ backgroundColor: theme.info, marginBottom: 16 }}
        onClick={onViewMap}
      />
      
      {isOwner && (
        <>
          {renderStatusButtons()}
          
          <View style={styles.actionButtons}>
            <Button
              icon={<Ionicons name="create-outline" size={16} color="white" />}
              label="Modify"
              styleButton={{ backgroundColor: theme.primary, flex: 1 }}
              styleLabel={{ color: theme.buttonText }}
              onClick={onModify}
            />
            <Button
              icon={<Ionicons name="trash-outline" size={16} color="white" />}
              label="Delete"
              styleButton={{ backgroundColor: theme.error, flex: 1 }}
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
  headerRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "bold",
    marginLeft: 6,
  },
  ownerBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ownerText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
  },
  scheduleContainer: {
    marginVertical: 16,
    padding: 12,
    borderWidth: 1,
    borderRadius: 10,
  },
  scheduleBlock: {
    marginVertical: 6,
  },
  scheduleHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  scheduleLabel: {
    fontSize: 15,
    marginLeft: 28,
  },
  scheduleTime: {
    fontSize: 14,
    marginLeft: 28,
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
  statusButtons: {
    marginBottom: 16,
  },
  buttonsRow: {
    flexDirection: "row",
    gap: 8,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
});

export default ActivityView;
