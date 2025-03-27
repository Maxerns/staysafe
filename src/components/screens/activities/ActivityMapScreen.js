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
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import axios from "axios";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../../UI/Button";
import { useContacts } from "../../context/contactContext";
import { useTheme } from "../../context/themeContext";
import LocationCard from "../../entity/activities/LocationCard";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH * 0.8;
const CARD_SPACING = 10;

const ActivityMapScreen = ({ navigation, route }) => {
  // Initialisations ---------------------------------
  const { isViewMode, activityStatus, userId } = route.params || {};
  const { getContactLiveLocation } = useContacts();

  const mapRef = useRef(null);
  const scrollViewRef = useRef(null);
  const locationRef = useRef([null, null]);
  const liveLocationIntervalRef = useRef(null);

  // State -------------------------------------------
  const [locations, setLocations] = useState([null, null]); // [from, to]
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
  const { theme } = useTheme();

  // Handlers ----------------------------------------

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
      console.log("Fetching live location for user ID:", userId);

      let liveLocation;
      try {
        liveLocation = await getContactLiveLocation(userId);
        console.log("Live location fetched:", liveLocation);
      } catch (err) {
        console.error("Error from getContactLiveLocation:", err);
        // Try to use device's current location as fallback
        liveLocation = await locationService.getCurrentLocation();
        console.log("Using current device location as fallback:", liveLocation);
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
          LocationName: "User's Live Location",
          LocationAddress: `Last updated: ${new Date(
            liveLocation.timestamp || Date.now()
          ).toLocaleString()}`,
          LocationDescription: "Real-time position",
        };

        setLocations((prevLocations) => {
          const updatedLocations = [...prevLocations];
          updatedLocations[2] = liveLocationPoint;
          return updatedLocations;
        });

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

  useEffect(() => {
    if (isViewMode && activityStatus === 2 && userId) {
      fetchLiveLocation();

      // Set up polling every 15 seconds
      liveLocationIntervalRef.current = setInterval(fetchLiveLocation, 15000);
    }

    // Cleanup on unmount
    return () => {
      if (liveLocationIntervalRef.current) {
        clearInterval(liveLocationIntervalRef.current);
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
          LocationName: "",
          LocationDescription: "",
        };

        if (activePoint === 0 || activePoint === 1) {
          const newLocations = [...locationRef.current];
          newLocations[activePoint] = {
            ...newLocation,
            LocationName: locationRef.current[activePoint]?.LocationName || "",
            LocationDescription:
              locationRef.current[activePoint]?.LocationDescription || "",
          };
          locationRef.current = newLocations;
          setLocations(newLocations);
          setActivePoint(null);
        } else {
          if (!locationRef.current[0]) {
            const newLocations = [...locationRef.current];
            newLocations[0] = {
              ...newLocation,
              LocationName: "",
              LocationDescription: "",
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
              LocationName: "",
              LocationDescription: "",
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

    if (
      !locationRef.current[0].LocationName ||
      !locationRef.current[0].LocationDescription ||
      !locationRef.current[1].LocationName ||
      !locationRef.current[1].LocationDescription
    ) {
      Alert.alert(
        "Missing Information",
        "Please fill in title and description for both points"
      );
      return;
    }

    if (route.params?.onLocationsSelected) {
      route.params.onLocationsSelected(locationRef.current);
    }

    navigation.goBack();
  };

  // Define canSave based on the conditions for saving locations
  const canSave =
    locationRef.current[0] &&
    locationRef.current[1] &&
    locationRef.current[0].LocationName &&
    locationRef.current[0].LocationDescription &&
    locationRef.current[1].LocationName &&
    locationRef.current[1].LocationDescription;

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

  const handleEditPoint = (pointIndex, field, value) => {
    const newLocations = [...locationRef.current];
    newLocations[pointIndex] = {
      ...newLocations[pointIndex],
      [field]: value,
    };
    locationRef.current = newLocations;
    setLocations(newLocations);
  };

  // View --------------------------------------------
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <MapView
        ref={mapRef}
        style={styles.map}
        region={mapRegion}
        onPress={handleMapPress}
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
              <ActivityIndicator size="small" color="#FFFFFF" />
              <Text style={styles.liveStatusText}>Updating location...</Text>
            </View>
          ) : liveLocationError ? (
            <View style={styles.liveStatusContent}>
              <Ionicons name="alert-circle" size={16} color="#FFFFFF" />
              <Text style={styles.liveStatusText}>{liveLocationError}</Text>
            </View>
          ) : locations[2] ? (
            <View style={styles.liveStatusContent}>
              <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" />
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
          {locations.map((location, index) => (
            <LocationCard
              key={index}
              point={location}
              pointIndex={index}
              isViewMode={isViewMode}
              onRemove={removePoint}
              onFocus={focusMapOnPoint}
              onEdit={handleEditPoint}
              theme={theme}
            />
          ))}
        </ScrollView>

        <View style={styles.paginationContainer}>
          <View
            style={[
              styles.paginationDot,
              { backgroundColor: locations[0] ? "#2196F3" : "#BDBDBD" },
            ]}
          />
          <View
            style={[
              styles.paginationDot,
              { backgroundColor: locations[1] ? "#4CAF50" : "#BDBDBD" },
            ]}
          />
          {locations[2] && (
            <View
              style={[styles.paginationDot, { backgroundColor: "#F44336" }]}
            />
          )}
        </View>
      </View>

      {!isViewMode && (
        <View style={styles.saveButtonContainer}>
          <Button
            label={canSave ? "Save Locations" : "Submit Locations"}
            styleButton={[
              styles.saveButton,
              !canSave && styles.disabledSaveButton,
            ]}
            styleLabel={styles.saveButtonText}
            onClick={handleSave}
            disabled={!canSave}
          />
        </View>
      )}

      {isViewMode && !isLiveLocationFetched && activityStatus === 2 && (
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={fetchLiveLocation}
        >
          <Ionicons name="refresh" size={24} color="#FFFFFF" />
          <Text style={styles.refreshButtonText}>Refresh Live Location</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
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
    zIndex: 100, // Ensure button appears above other elements
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    borderRadius: 10,
  },
  disabledSaveButton: {
    backgroundColor: "#A5D6A7", // Lighter green for disabled state
    opacity: 0.8,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center", // Ensure text is centered
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
    backgroundColor: "#2196F3",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  refreshButtonText: {
    color: "#FFFFFF",
    marginLeft: 8,
    fontWeight: "bold",
  },
});

export default ActivityMapScreen;