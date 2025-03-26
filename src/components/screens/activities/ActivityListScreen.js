import { useContext, useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ActivityList from "../../entity/activities/ActivityList";
import Screen from "../../layout/Screen";
import { useActivities } from "../../context/activityContext";
import { AuthContext } from "../../context/authContext.js";
import { useTheme } from "../../context/themeContext";

const ActivityListScreen = ({ navigation }) => {
  // Initialisations ---------------------------------
  const { user } = useContext(AuthContext);
  const { theme } = useTheme();
  const {
    activities,
    loading,
    error,
    addActivity,
    deleteActivity,
    updateActivity,
    refreshActivities,
  } = useActivities();

  // State -------------------------------------------
  const [refreshing, setRefreshing] = useState(false);

  // Handlers ----------------------------------------
  const onAdd = async (activityData) => {
    try {
      await addActivity(activityData);
      navigation.goBack();
    } catch (err) {
      console.error("Error adding activity:", err);
    }
  };

  const onDelete = async (activity) => {
    try {
      await deleteActivity(activity);
      navigation.goBack();
    } catch (err) {
      console.error("Error deleting activity:", err);
    }
  };

  const onModify = async (activityData) => {
    try {
      await updateActivity(activityData);
      navigation.goBack();
    } catch (err) {
      console.error("Error updating activity:", err);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshActivities();
    setRefreshing(false);
  };

  const goToViewScreen = (activity) =>
    navigation.navigate("ActivityViewScreen", { activity, onDelete, onModify });

  const goToAddScreen = () =>
    navigation.navigate("ActivityAddScreen", { onAdd });

  // View --------------------------------------------
  return (
    <Screen style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../../../assets/StaySafeVector.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>Activities</Text>
          <Text style={styles.subtitle}>
            Welcome back, {user.info.username}
          </Text>
        </View>
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#122f76" />
          <Text style={styles.loadingText}>Loading your activities...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={60} color="#ff3b3b" />
          <Text style={styles.errorText}>Something went wrong.</Text>
          <Text style={styles.errorSubtext}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
            <Ionicons name="refresh" size={16} color="white" />
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : activities.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={80} color="#d0d0d0" />
          <Text style={styles.emptyText}>No activities yet</Text>
          <Text style={styles.emptySubtext}>
            Create a new activity to track your journeys and stay safe
          </Text>
          <TouchableOpacity
            style={styles.emptyAddButton}
            onPress={goToAddScreen}
          >
            <Ionicons name="add" size={20} color="white" />
            <Text style={styles.emptyAddButtonText}>Create First Activity</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.listContainer}>
          <ActivityList activities={activities} onSelect={goToViewScreen} />

          {refreshing && (
            <View style={styles.refreshIndicator}>
              <ActivityIndicator size="small" color="#122f76" />
            </View>
          )}
        </View>
      )}

      {/* FAB Button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme?.primary || "#122f76" }]}
        onPress={goToAddScreen}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "colors.background",
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: "colors.card",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "colors.shadow",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  logo: {
    width: 120,
    height: 60,
  },
  headerTextContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "colors.primary",
  },
  subtitle: {
    fontSize: 16,
    color: "colors.text",
    marginTop: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: "colors.text",
  },
  listContainer: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
  },
  errorSubtext: {
    fontSize: 14,
    color: "#777",
    marginTop: 10,
    textAlign: "center",
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff3b3b",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginTop: 20,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#555",
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 16,
    color: "#888",
    marginTop: 10,
    textAlign: "center",
    lineHeight: 24,
  },
  emptyAddButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff3b3b",
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 30,
    marginTop: 30,
  },
  emptyAddButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
  refreshIndicator: {
    alignItems: "center",
    paddingVertical: 15,
  },
  // FAB styles
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    right: 20,
    bottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 999,
  },
});

export default ActivityListScreen;
