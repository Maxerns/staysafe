import { StyleSheet, Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

const ActivityItem = ({ activity, onSelect }) => {
  // Initialisations ---------------------------------
  const { user } = useContext(AuthContext);
  const isOwner = activity.ActivityUserID === user.info.id;

  // Get status information
  const getStatusInfo = () => {
    switch (activity.ActivityStatusID) {
      case 1:
        return { text: "Planned", color: "#9E9E9E", icon: "calendar-outline" };
      case 2:
        return { text: "In Progress", color: "#2196F3", icon: "walk-outline" };
      case 3:
        return { text: "Paused", color: "#FF9800", icon: "pause-outline" };
      case 4:
        return {
          text: "Cancelled",
          color: "#F44336",
          icon: "close-circle-outline",
        };
      case 5:
        return {
          text: "Completed",
          color: "#4CAF50",
          icon: "checkmark-circle-outline",
        };
      default:
        return {
          text: "Unknown",
          color: "#9E9E9E",
          icon: "help-circle-outline",
        };
    }
  };

  const statusInfo = getStatusInfo();

  // Format date for better display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  // View --------------------------------------------
  return (
    <Pressable
      onPress={() => onSelect(activity)}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <View style={styles.item}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {activity.ActivityName ||
              activity.ActivityLabel ||
              "Unnamed Activity"}
          </Text>
          {isOwner && (
            <View style={styles.ownerBadge}>
              <Text style={styles.ownerText}>Owner</Text>
            </View>
          )}
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {activity.ActivityDescription || "No description provided"}
        </Text>

        <View style={styles.details}>
          <View style={styles.dateContainer}>
            <Ionicons name="time-outline" size={16} color="#757575" />
            <Text style={styles.dateText}>
              {formatDate(activity.ActivityLeave)} -{" "}
              {formatDate(activity.ActivityArrive)}
            </Text>
          </View>

          <View
            style={[
              styles.statusContainer,
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
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: "white",
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    overflow: "hidden",
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  item: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#122f76",
    flex: 1,
  },
  ownerBadge: {
    backgroundColor: "#122f76",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  ownerText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    color: "#757575",
    marginBottom: 12,
  },
  details: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    fontSize: 12,
    color: "#757575",
    marginLeft: 4,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 4,
  },
});

export default ActivityItem;
