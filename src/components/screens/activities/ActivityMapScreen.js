import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Image,
  SafeAreaView,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import axios from "axios";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../../UI/Button";
import { useContacts } from "../../context/contactContext";
import { useTheme } from "../../context/themeContext";
import { useActivities } from "../../context/activityContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH * 0.8;
const CARD_SPACING = 10;

const ActivityMapScreen = ({ navigation, route }) => {
  // Initialisations ---------------------------------
  const { activityId, isViewMode, activityStatus, userId } = route.params || {};
  const { getContactLiveLocation } = useContacts();
  const { loadLocation } = useActivities();
  const { theme, isDarkMode } = useTheme();

  const mapRef = useRef(null);
  const scrollViewRef = useRef(null);
  const locationRef = useRef([null, null, null]); // [from, to, live]
  const liveLocationIntervalRef = useRef(null);

  // State -------------------------------------------
  const [locations, setLocations] = useState([null, null, null]); // [from, to, live]
  const [activePoint, setActivePoint] = useState(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [isLiveLocationFetched, setIsLiveLocationFetched] = useState(false);
  const [liveLocationError, setLiveLocationError] = useState(null);
  const [isLiveLocationLoading, setIsLiveLocationLoading] = useState(false);
  const [isLoadingInitialLocations, setIsLoadingInitialLocations] = useState(false);

  // Load locations for view mode -------------------------------------
  useEffect(() => {
    const loadLocationsFromActivity = async () => {
      if (isViewMode && activityId) {
        try {
          setIsLoadingInitialLocations(true);
          
          // Load activity locations from the database
          const fromLocation = await loadLocation(route.params?.fromLocationId);
          const toLocation = await loadLocation(route.params?.toLocationId);
          
          if (fromLocation && fromLocation[0] && toLocation && toLocation[0]) {
            const newLocations = [fromLocation[0], toLocation[0], null];
            locationRef.current = newLocations;
            setLocations(newLocations);
            
            // Set map region based on first location
            if (
              fromLocation[0].LocationLatitude &&
              fromLocation[0].LocationLongitude
            ) {
              setMapRegion({
                latitude: parseFloat(fromLocation[0].LocationLatitude),
                longitude: parseFloat(fromLocation[0].LocationLongitude),
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              });
            }
          }
        } catch (error) {
          console.error("Error loading activity locations:", error);
          Alert.alert("Error", "Failed to load activity locations");
        } finally {
          setIsLoadingInitialLocations(false);
        }
      }
    };
    
    loadLocationsFromActivity();
  }, [activityId, isViewMode]);

  const reverseGeocode = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
      );

      if (response.data) {
        const addressParts = response.data.display_name.split(",").slice(0, 2);
        const address = addressParts.join(", ");
        const postcode = response.data.address?.postcode || "";
        return { address, postcode };
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      Alert.alert("Address Error", "Could not retrieve address information");
    }
    return { address: "", postcode: "" };
  };

  useEffect(() => {
    if (route.params?.locations) {
      const initialLocations = route.params.locations;
      if (initialLocations[0] && initialLocations[1]) {
        console.log("Setting initial locations:", initialLocations);
        setLocations(initialLocations);
        locationRef.current = initialLocations;

        // Set map region based on first location
        if (
          initialLocations[0].LocationLatitude &&
          initialLocations[0].LocationLongitude
        ) {
          setMapRegion({
            latitude: parseFloat(initialLocations[0].LocationLatitude),
            longitude: parseFloat(initialLocations[0].LocationLongitude),
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          });
        }
      }
    }
  }, [route.params]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location access is required to use this feature"
        );
        return;
      }

      try {
        const location = await Location.getCurrentPositionAsync({});
        setMapRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      } catch (error) {
        console.error("Error getting location:", error);
        Alert.alert(
          "Location Error",
          "Could not determine your current location"
        );
      }
    })();
  }, []);

  const fetchLiveLocation = async () => {
    if (!(isViewMode && activityStatus === 2 && userId)) return;

    try {
      setIsLiveLocationLoading(true);
      setLiveLocationError(null);
      
      let liveLocation = null;
      
      try {
        // First try to get location from the API
        liveLocation = await getContactLiveLocation(userId);
        console.log("Live location from API:", liveLocation);
      } catch (err) {
        console.error("Error getting location from API:", err);
      }
      
      // If API failed, try device location as fallback for demo/testing
      if (!liveLocation || !liveLocation.latitude || !liveLocation.longitude) {
        try {
          console.log("Trying device location as fallback");
          const deviceLocation = await Location.getCurrentPositionAsync({});
          liveLocation = {
            latitude: deviceLocation.coords.latitude,
            longitude: deviceLocation.coords.longitude,
            timestamp: deviceLocation.timestamp,
          };
          console.log("Using device location:", liveLocation);
        } catch (deviceErr) {
          console.error("Error getting device location:", deviceErr);
          throw new Error("Could not get location from any source");
        }
      }

      if (
        liveLocation &&
        !isNaN(liveLocation.latitude) &&
        !isNaN(liveLocation.longitude)
      ) {
        // Add live location as a third point
        const liveLocationPoint = {
          LocationLatitude: liveLocation.latitude,
          LocationLongitude: liveLocation.longitude,
          LocationName: "Live Location",
          LocationAddress: `Last updated: ${new Date(
            liveLocation.timestamp || Date.now()
          ).toLocaleTimeString()}`,
          LocationDescription: "Real-time position",
        };

        // Update locations array and reference
        const updatedLocations = [...locations];
        updatedLocations[2] = liveLocationPoint;
        setLocations(updatedLocations);
        locationRef.current = updatedLocations;

        // Focus map on live location
        if (mapRef.current) {
          mapRef.current.animateToRegion(
            {
              latitude: liveLocation.latitude,
              longitude: liveLocation.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            },
            500
          );
        }

        setIsLiveLocationFetched(true);
      } else {
        throw new Error("Received invalid location data");
      }
    } catch (error) {
      console.error("Error in fetchLiveLocation:", error);
      setLiveLocationError(`Could not get location: ${error.message}`);
    } finally {
      setIsLiveLocationLoading(false);
    }
  };

  // Set up live location tracking
  useEffect(() => {
    if (isViewMode && activityStatus === 2 && userId) {
      // Fetch immediately
      fetchLiveLocation();

      // Set up polling every 15 seconds
      liveLocationIntervalRef.current = setInterval(fetchLiveLocation, 15000);
    }

    // Cleanup on unmount
    return () => {
      if (liveLocationIntervalRef.current) {
        clearInterval(liveLocationIntervalRef.current);
        liveLocationIntervalRef.current = null;
      }
    };
  }, [isViewMode, activityStatus, userId]);

  const handleMapPress = isViewMode
    ? () => {}
    : async (event) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        const geoData = await reverseGeocode(latitude, longitude);
        const newLocation = {
          LocationLatitude: latitude,
          LocationLongitude: longitude,
          LocationAddress: geoData.address,
          LocationPostcode: geoData.postcode,
          // No longer requiring user input for these fields
          LocationName: activePoint === 0 ? "Starting Point" : "Destination Point",
          LocationDescription: geoData.address || "",
        };

        if (activePoint === 0 || activePoint === 1) {
          const newLocations = [...locationRef.current];
          newLocations[activePoint] = newLocation;
          locationRef.current = newLocations;
          setLocations(newLocations);
          setActivePoint(null);
        } else {
          if (!locationRef.current[0]) {
            const newLocations = [...locationRef.current];
            newLocations[0] = {
              ...newLocation,
              LocationName: "Starting Point",
            };
            locationRef.current = newLocations;
            setLocations(newLocations);
            // Scroll to Point A card after a short delay
            setTimeout(() => {
              scrollViewRef.current?.scrollTo({ x: 0, animated: true });
            }, 300);
          } else if (!locationRef.current[1]) {
            const newLocations = [...locationRef.current];
            newLocations[1] = {
              ...newLocation,
              LocationName: "Destination Point",
            };
            locationRef.current = newLocations;
            setLocations(newLocations);
            // Scroll to Point B card after a short delay
            setTimeout(() => {
              scrollViewRef.current?.scrollTo({
                x: CARD_WIDTH + CARD_SPACING,
                animated: true,
              });
            }, 300);
          } else {
            Alert.alert(
              "Both Points Set",
              "Tap the edit button on a card to update its location",
              [{ text: "OK", style: "default" }]
            );
          }
        }
      };

  const removePoint = (pointIndex) => {
    const newLocations = [...locationRef.current];
    newLocations[pointIndex] = null;
    locationRef.current = newLocations;
    setLocations(newLocations);
  };

  const handleSave = () => {
    if (!locationRef.current[0] || !locationRef.current[1]) {
      Alert.alert(
        "Missing Locations",
        "Please select both Point A and Point B"
      );
      return;
    }

    // Remove validation for title and description fields
    if (route.params?.onLocationsSelected) {
      route.params.onLocationsSelected(locationRef.current);
    }

    navigation.goBack();
  };

  const focusMapOnPoint = (point) => {
    if (!point || !mapRef.current) return;

    mapRef.current.animateToRegion(
      {
        latitude: parseFloat(point.LocationLatitude),
        longitude: parseFloat(point.LocationLongitude),
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      500
    );
  };

  // View --------------------------------------------

  // View component for location cards
  const LocationCard = (point, pointIndex) => {
    if (!point) {
      // Render empty card with instructions
      return (
        <View
          style={[
            styles.card,
            styles.emptyCard,
            { backgroundColor: theme.card },
          ]}
        >
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.pointBadge,
                {
                  backgroundColor:
                    pointIndex === 0 ? theme.info : theme.success,
                },
              ]}
            >
              <Text style={styles.pointBadgeText}>
                {pointIndex === 0 ? "From" : "To"}
              </Text>
            </View>
            <Text style={[styles.cardTitle, { color: theme.text }]}>
              {isViewMode
                ? "Location not available"
                : `Tap on map to set Point ${pointIndex === 0 ? "From" : "To"}`}
            </Text>
          </View>
          <View style={styles.emptyCardContent}>
            <Ionicons
              name="location-outline"
              size={32}
              color={isDarkMode ? "#555" : "#BDBDBD"}
            />
            <Text style={[styles.emptyCardText, { color: theme.text }]}>
              {isViewMode
                ? "Location data could not be loaded"
                : "Select a location on the map"}
            </Text>
          </View>
        </View>
      );
    }

    const isPointA = pointIndex === 0;
    const isLivePoint = pointIndex === 2;
    const cardColor = isLivePoint
      ? isDarkMode
        ? "#331111"
        : "#FFEBEE"
      : isPointA
      ? isDarkMode
        ? "#102236"
        : "#E3F2FD"
      : isDarkMode
      ? "#0F2415"
      : "#E8F5E9";
    const badgeColor = isLivePoint
      ? theme.error
      : isPointA
      ? theme.info
      : theme.success;
    const pointLabel = isLivePoint ? "Live" : pointIndex === 0 ? "From" : "To";

    return (
      <View style={[styles.card, { backgroundColor: cardColor }]}>
        <View style={styles.cardHeader}>
          <View style={[styles.pointBadge, { backgroundColor: badgeColor }]}>
            <Text style={styles.pointBadgeText}>{pointLabel}</Text>
          </View>
          <Text
            style={[styles.cardTitle, { color: theme.text }]}
            numberOfLines={1}
          >
            {pointIndex === 0 ? "Starting Point" : pointIndex === 1 ? "Destination Point" : "Live Location"}
          </Text>
          {!isViewMode && !isLivePoint && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => removePoint(pointIndex)}
            >
              <Ionicons name="trash-outline" size={20} color={theme.error} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.addressContainer}>
          <Ionicons
            name="location-outline"
            size={16}
            color={isDarkMode ? "#aaa" : "#757575"}
          />
          <Text
            style={[styles.addressText, { color: theme.text }]}
            numberOfLines={2}
          >
            {point.LocationAddress || "Address not available"}
          </Text>
        </View>

        {point.LocationPostcode ? (
          <View style={styles.postcodeContainer}>
            <Ionicons
              name="mail-outline"
              size={16}
              color={isDarkMode ? "#aaa" : "#757575"}
            />
            <Text style={[styles.postcodeText, { color: theme.text }]}>
              {point.LocationPostcode}
            </Text>
          </View>
        ) : null}

        {/* Remove the input container that was here */}

        <View style={styles.cardActions}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.focusButton,
              { backgroundColor: isDarkMode ? "#455A64" : "#607D8B" },
            ]}
            onPress={() => focusMapOnPoint(point)}
          >
            <Ionicons
              name="locate-outline"
              size={16}
              color={theme.buttonText}
            />
            <Text
              style={[styles.actionButtonText, { color: theme.buttonText }]}
            >
              Focus
            </Text>
          </TouchableOpacity>
          {!isViewMode && !isLivePoint && (
            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.editButton,
                { backgroundColor: theme.info },
              ]}
              onPress={() => {
                setActivePoint(pointIndex);
              }}
            >
              <Ionicons
                name="create-outline"
                size={16}
                color={theme.buttonText}
              />
              <Text
                style={[styles.actionButtonText, { color: theme.buttonText }]}
              >
                Edit
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const canSave = locationRef.current[0] && locationRef.current[1];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >

      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          region={mapRegion}
          onPress={handleMapPress}
          userInterfaceStyle={isDarkMode ? "dark" : "light"}
        >
          {locations.map((location, index) =>
            location ? (
              <Marker
                key={index}
                coordinate={{
                  latitude: parseFloat(location.LocationLatitude) || 0,
                  longitude: parseFloat(location.LocationLongitude) || 0,
                }}
                pinColor={index === 2 ? "red" : index === 0 ? "blue" : "green"} // Red for live location
                title={
                  location.LocationName ||
                  (index === 2 ? "Live Location" : index === 0 ? "From" : "To")
                }
                description={
                  location.LocationDescription || location.LocationAddress
                }
              />
            ) : null
          )}
        </MapView>

        {activePoint !== null && !isViewMode && (
          <View style={styles.activePointIndicator}>
            <Text style={styles.activePointText}>
              Tap on map to set Point {activePoint === 0 ? "From" : "To"}
            </Text>
          </View>
        )}

        {isViewMode && activityStatus === 2 && (
          <View style={styles.liveLocationStatus}>
            {isLiveLocationLoading ? (
              <View style={styles.liveStatusContent}>
                <ActivityIndicator size="small" color={theme.buttonText} />
                <Text style={styles.liveStatusText}>Updating location...</Text>
              </View>
            ) : liveLocationError ? (
              <View style={styles.liveStatusContent}>
                <Ionicons
                  name="alert-circle"
                  size={16}
                  color={theme.buttonText}
                />
                <Text style={styles.liveStatusText}>{liveLocationError}</Text>
              </View>
            ) : locations[2] ? (
              <View style={styles.liveStatusContent}>
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color={theme.buttonText}
                />
                <Text style={styles.liveStatusText}>Live tracking active</Text>
              </View>
            ) : null}
          </View>
        )}

        <View style={styles.cardsContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContent}
            snapToInterval={CARD_WIDTH + CARD_SPACING}
            decelerationRate="fast"
            pagingEnabled
          >
            {LocationCard(locations[0], 0)}
            {LocationCard(locations[1], 1)}
            {locations[2] && LocationCard(locations[2], 2)}
          </ScrollView>

          <View style={styles.paginationContainer}>
            <View
              style={[
                styles.paginationDot,
                {
                  backgroundColor: locations[0]
                    ? theme.info
                    : isDarkMode
                    ? "#444"
                    : "#BDBDBD",
                },
              ]}
            />
            <View
              style={[
                styles.paginationDot,
                {
                  backgroundColor: locations[1]
                    ? theme.success
                    : isDarkMode
                    ? "#444"
                    : "#BDBDBD",
                },
              ]}
            />
            {locations[2] && (
              <View
                style={[styles.paginationDot, { backgroundColor: theme.error }]}
              />
            )}
          </View>
        </View>

        {!isViewMode && canSave && (
          <View style={styles.saveButtonContainer}>
            <Button
              label="Save Locations"
              styleButton={[
                styles.saveButton,
                { backgroundColor: theme.primary },
              ]}
              styleLabel={[styles.saveButtonText, { color: theme.buttonText }]}
              onClick={handleSave}
            />
          </View>
        )}

        {isViewMode && !isLiveLocationFetched && activityStatus === 2 && (
          <TouchableOpacity
            style={[styles.refreshButton, { backgroundColor: theme.primary }]}
            onPress={fetchLiveLocation}
          >
            <Ionicons name="refresh" size={24} color={theme.buttonText} />
            <Text
              style={[styles.refreshButtonText, { color: theme.buttonText }]}
            >
              Refresh Live Location
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
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
  },
  subtitle: {
    fontSize: 16,
    marginTop: 5,
    textAlign: "center",
  },
  mapContainer: {
    flex: 1,
    position: "relative",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  cardsContainer: {
    position: "absolute",
    top: 20,
    left: 0,
    right: 0,
  },
  scrollViewContent: {
    paddingHorizontal: (SCREEN_WIDTH - CARD_WIDTH) / 2,
    paddingBottom: 10,
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: CARD_SPACING / 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyCard: {
    justifyContent: "center",
    alignItems: "center",
    height: 200,
  },
  emptyCardContent: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyCardText: {
    marginTop: 10,
    textAlign: "center",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  pointBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  pointBadgeText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
  },
  iconButton: {
    padding: 4,
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  addressText: {
    flex: 1,
    fontSize: 14,
    marginLeft: 8,
  },
  postcodeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  postcodeText: {
    fontSize: 14,
    marginLeft: 8,
  },
  descriptionContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  descriptionText: {
    flex: 1,
    fontSize: 14,
    marginLeft: 8,
    fontStyle: "italic",
  },
  inputContainer: {
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    marginBottom: 8,
  },
  descriptionInput: {
    minHeight: 60,
    textAlignVertical: "top",
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
  focusButton: {
    backgroundColor: "#607D8B",
  },
  editButton: {
    backgroundColor: "#2196F3",
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 4,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  saveButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  saveButton: {
    paddingVertical: 14,
    borderRadius: 10,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  activePointIndicator: {
    position: "absolute",
    top: 20,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 1,
  },
  activePointText: {
    backgroundColor: "rgba(33, 150, 243, 0.9)",
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  liveLocationStatus: {
    position: "absolute",
    top: 70,
    alignSelf: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  liveStatusContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  liveStatusText: {
    color: "#FFFFFF",
    marginLeft: 8,
    fontWeight: "bold",
  },
  refreshButton: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  refreshButtonText: {
    marginLeft: 8,
    fontWeight: "bold",
  },
});

export default ActivityMapScreen;
