import { StyleSheet, Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { useTheme } from "../../context/themeContext";

const ActivityItem = ({ activity, onSelect }) => {
  // Initialisations ---------------------------------
  const { user } = useContext(AuthContext);
  const { theme } = useTheme();
  const isOwner = activity.ActivityUserID === user.info.id;

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
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: theme.card },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.item}>
        <View style={styles.header}>
          <Text
            style={[styles.title, { color: theme.primary }]}
            numberOfLines={1}
          >
            {activity.ActivityName ||
              activity.ActivityLabel ||
              "Unnamed Activity"}
          </Text>
          
          <View style={styles.headerRight}>
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
            
            {isOwner && (
              <View
                style={[styles.ownerBadge, { backgroundColor: theme.primary }]}
              >
                <Text style={styles.ownerText}>Owner</Text>
              </View>
            )}
          </View>
        </View>

        <Text
          style={[styles.description, { color: theme.text }]}
          numberOfLines={2}
        >
          {activity.ActivityDescription || "No description provided"}
        </Text>

        <View style={styles.datesSection}>
          <View style={styles.dateContainer}>
            <Ionicons name="arrow-forward-outline" size={16} color={theme.inactive} />
            <Text style={[styles.dateLabel, { color: theme.inactive }]}>Departure:</Text>
            <Text style={[styles.dateText, { color: theme.text }]}>{formatDate(activity.ActivityLeave)}</Text>
          </View>
          
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          
          <View style={styles.dateContainer}>
            <Ionicons name="arrow-down-outline" size={16} color={theme.inactive} />
            <Text style={[styles.dateLabel, { color: theme.inactive }]}>Arrival:</Text>
            <Text style={[styles.dateText, { color: theme.text }]}>{formatDate(activity.ActivityArrive)}</Text>
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
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    marginRight: 8,
  },
  ownerBadge: {
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
    marginBottom: 12,
  },
  datesSection: {
    backgroundColor: theme => theme.backgroundAlt || '#f5f5f5',
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  dateLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 8,
    width: 70,
  },
  dateText: {
    fontSize: 12,
    marginLeft: 4,
  },
  divider: {
    height: 1,
    marginVertical: 6,
  },
  details: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 8,
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
