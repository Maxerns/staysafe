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
    return date.toLocaleDateString() + " · " + 
           date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
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
        {/* Badges row - both badges in one row */}
        <View style={styles.badgesRow}>
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

          {isOwner ? (
            <View
              style={[styles.ownerBadge, { backgroundColor: theme.primary }]}
            >
              <Text style={styles.ownerText}>You</Text>
            </View>
          ) : (
            <View
              style={[styles.userBadge, { backgroundColor: theme.info }]}
            >
              <Text style={styles.ownerText}>{activity.ActivityUsername}</Text>
            </View>
          )}
        </View>

        <Text
          style={[styles.title, { color: theme.primary }]}
          numberOfLines={1}
        >
          {activity.ActivityName ||
            activity.ActivityLabel ||
            "Unnamed Activity"}
        </Text>

        <Text
          style={[styles.description, { color: theme.text }]}
          numberOfLines={2}
        >
          {activity.ActivityDescription || "No description provided"}
        </Text>

        {/* Simplified date section */}
        <View style={styles.datesContainer}>
          <View style={styles.dateRow}>
            <View style={styles.dateItem}>
              <Ionicons name="time-outline" size={16} color={theme.inactive} />
              <Text style={[styles.dateLabel, { color: theme.inactive }]}>Departure:</Text>
              <Text style={[styles.dateText, { color: theme.text }]}>{formatDate(activity.ActivityLeave)}</Text>
            </View>
          </View>
          
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          
          <View style={styles.dateRow}>
            <View style={styles.dateItem}>
              <Ionicons name="flag-outline" size={16} color={theme.inactive} />
              <Text style={[styles.dateLabel, { color: theme.inactive }]}>Arrival:</Text>
              <Text style={[styles.dateText, { color: theme.text }]}>{formatDate(activity.ActivityArrive)}</Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
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
  badgesRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
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
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  ownerBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  userBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ownerText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    marginBottom: 14,
    lineHeight: 20,
  },
  datesContainer: {
    marginTop: 4,
  },
  dateRow: {
    flexDirection: 'row',
    paddingVertical: 4,
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 8,
    marginRight: 4,
  },
  dateText: {
    fontSize: 13,
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
});

export default ActivityItem;
