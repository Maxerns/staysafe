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
  SafeAreaView,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import axios from "axios";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../../UI/Button";
import Screen from "../../layout/Screen";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH * 0.8;
const CARD_SPACING = 10;



const MapLocationSelectionScreen = ({ navigation, route }) => {
  // Initialisations ---------------------------------
  useEffect(() => {
    if (route.params?.locations) {
      setLocations(route.params.locations);
      locationRef.current = route.params.locations;
    }
  }, [route.params]);

  // Get user's current location on mount
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

  const mapRef = useRef(null);
  const scrollViewRef = useRef(null);
  const locationRef = useRef([null, null]);

  // State -------------------------------------------
  const [locations, setLocations] = useState([null, null]); // [from, to]
  const [activePoint, setActivePoint] = useState(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  // Handlers ----------------------------------------
  // Reverse geocode to get address from coordinates
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

  const handleMapPress = useCallback(
    async (event) => {
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
    },
    [activePoint]
  );

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

  const focusMapOnPoint = (point) => {
    if (!point || !mapRef.current) return;

    mapRef.current.animateToRegion(
      {
        latitude: point.LocationLatitude,
        longitude: point.LocationLongitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      500
    );
  };

  // View --------------------------------------------

  const LocationCard = (point, pointIndex) => {
    if (!point) {
      // Render empty card with instructions
      return (
        <View style={[styles.card, styles.emptyCard]}>
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.pointBadge,
                { backgroundColor: pointIndex === 0 ? "#2196F3" : "#4CAF50" },
              ]}
            >
              <Text style={styles.pointBadgeText}>
                {pointIndex === 0 ? "From" : "To"}
              </Text>
            </View>
            <Text style={styles.cardTitle}>
              Tap on map to set Point {pointIndex === 0 ? "From" : "To"}
            </Text>
          </View>
          <View style={styles.emptyCardContent}>
            <Ionicons name="location-outline" size={32} color="#BDBDBD" />
            <Text style={styles.emptyCardText}>
              Select a location on the map
            </Text>
          </View>
        </View>
      );
    }

    const isPointA = pointIndex === 0;
    const cardColor = isPointA ? "#E3F2FD" : "#E8F5E9";

    return (
      <View style={[styles.card, { backgroundColor: cardColor }]}>
        <View style={styles.cardHeader}>
          <View
            style={[
              styles.pointBadge,
              { backgroundColor: isPointA ? "#2196F3" : "#4CAF50" },
            ]}
          >
            <Text style={styles.pointBadgeText}>
              {pointIndex === 0 ? "From" : "To"}
            </Text>
          </View>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {point.LocationName || `Point ${pointIndex === 0 ? "From" : "To"}`}
          </Text>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => removePoint(pointIndex)}
          >
            <Ionicons name="trash-outline" size={20} color="#F44336" />
          </TouchableOpacity>
        </View>

        <View style={styles.addressContainer}>
          <Ionicons name="location-outline" size={16} color="#757575" />
          <Text style={styles.addressText} numberOfLines={2}>
            {point.LocationAddress || "Address not available"}
          </Text>
        </View>

        {point.LocationPostcode ? (
          <View style={styles.postcodeContainer}>
            <Ionicons name="mail-outline" size={16} color="#757575" />
            <Text style={styles.postcodeText}>{point.LocationPostcode}</Text>
          </View>
        ) : null}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Title"
            placeholderTextColor="#9E9E9E"
            value={point.LocationName}
            onChangeText={(text) => {
              const newLocations = [...locationRef.current];
              newLocations[pointIndex] = {
                ...newLocations[pointIndex],
                LocationName: text,
              };
              locationRef.current = newLocations;
              setLocations(newLocations);
            }}
          />

          <TextInput
            style={[styles.input, styles.descriptionInput]}
            placeholder="Description"
            placeholderTextColor="#9E9E9E"
            multiline
            numberOfLines={2}
            value={point.LocationDescription}
            onChangeText={(text) => {
              const newLocations = [...locationRef.current];
              newLocations[pointIndex] = {
                ...newLocations[pointIndex],
                LocationDescription: text,
              };
              locationRef.current = newLocations;
              setLocations(newLocations);
            }}
          />
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.focusButton]}
            onPress={() => focusMapOnPoint(point)}
          >
            <Ionicons name="locate-outline" size={16} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Focus</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => {
              setActivePoint(pointIndex);
            }}
          >
            <Ionicons name="create-outline" size={16} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const canSave =
    locationRef.current[0] &&
    locationRef.current[1] &&
    locationRef.current[0].LocationName &&
    locationRef.current[0].LocationDescription &&
    locationRef.current[1].LocationName &&
    locationRef.current[1].LocationDescription;

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        region={mapRegion}
        onPress={handleMapPress}
      >
        {locations[0] && (
          <Marker
            coordinate={{
              latitude: locations[0].LocationLatitude,
              longitude: locations[0].LocationLongitude,
            }}
            pinColor="blue"
            title={locations[0].LocationName || "Point From"}
            description={locations[0].LocationAddress || ""}
          />
        )}
        {locations[1] && (
          <Marker
            coordinate={{
              latitude: locations[1].LocationLatitude,
              longitude: locations[1].LocationLongitude,
            }}
            pinColor="green"
            title={locations[1].LocationName || "Point To"}
            description={locations[1].LocationAddress || ""}
          />
        )}
      </MapView>

      {activePoint && (
        <View style={styles.activePointIndicator}>
          <Text style={styles.activePointText}>
            Tap on map to set Point {activePoint === 0 ? "From" : "To"}
          </Text>
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
        </ScrollView>
      </View>
      {canSave && (
        <Button
          icon={<Ionicons name="save-outline" size={24} color="#FFFFFF" />}
          label="Save Locations"
          onClick={handleSave}
          styleButton={styles.saveButton}
          styleLabel={styles.saveButtonText}
        />
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
    flex: 1,
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
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
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
    color: "#757575",
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
    color: "#212121",
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
    color: "#424242",
    marginLeft: 8,
  },
  postcodeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  postcodeText: {
    fontSize: 14,
    color: "#424242",
    marginLeft: 8,
  },
  inputContainer: {
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: "#212121",
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
    color: "#FFFFFF",
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
  saveButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginHorizontal: 20,
  },
  saveButtonText: {
    color: "#FFFFFF",
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
});

export default MapLocationSelectionScreen;