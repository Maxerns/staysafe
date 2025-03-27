import React from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH * 0.8;
const CARD_SPACING = 10;

const LocationCard = ({
  point,
  pointIndex,
  isViewMode,
  onRemove,
  onFocus,
  onEdit,
  theme,
}) => {
  if (!point) {
    return (
      <View style={[styles.card, styles.emptyCard, { backgroundColor: theme.card }]}>
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
          <Text style={[styles.cardTitle, { color: theme.primary }]}>
            {isViewMode
              ? "Location not available"
              : `Tap on map to set Point ${pointIndex === 0 ? "From" : "To"}`}
          </Text>
        </View>
        <View style={styles.emptyCardContent}>
          <Ionicons name="location-outline" size={32} color="#BDBDBD" />
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
  const badgeColor = isLivePoint
    ? "#F44336"
    : isPointA
    ? "#2196F3"
    : "#4CAF50";
  const pointLabel = isLivePoint ? "Live" : pointIndex === 0 ? "From" : "To";

  return (
    <View style={[styles.card, { backgroundColor: theme.card }]}>
      <View style={styles.cardHeader}>
        <View style={[styles.pointBadge, { backgroundColor: badgeColor }]}>
          <Text style={styles.pointBadgeText}>{pointLabel}</Text>
        </View>
        <Text style={[styles.cardTitle, { color: theme.primary }]} numberOfLines={1}>
          {point.LocationName || `Point ${pointLabel}`}
        </Text>
        {!isViewMode && !isLivePoint && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => onRemove(pointIndex)}
          >
            <Ionicons name="trash-outline" size={20} color="#F44336" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.addressContainer}>
        <Ionicons name="location-outline" size={16} color="#757575" />
        <Text style={[styles.addressText, { color: theme.text }]} numberOfLines={2}>
          {point.LocationAddress || "Address not available"}
        </Text>
      </View>

      {point.LocationPostcode && (
        <View style={styles.postcodeContainer}>
          <Ionicons name="mail-outline" size={16} color="#757575" />
          <Text style={[styles.postcodeText, { color: theme.text }]}>{point.LocationPostcode}</Text>
        </View>
      )}

      {point.LocationDescription && (
        <View style={styles.descriptionContainer}>
          <Ionicons
            name="information-circle-outline"
            size={16}
            color="#757575"
          />
          <Text style={[styles.descriptionText, { color: theme.text }]}>
            {point.LocationDescription}
          </Text>
        </View>
      )}

      {!isViewMode && !isLivePoint && (
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="Title"
            placeholderTextColor="#9E9E9E"
            value={point.LocationName}
            onChangeText={(text) => onEdit(pointIndex, "LocationName", text)}
          />

          <TextInput
            style={[styles.input, styles.descriptionInput, { color: theme.text }]}
            placeholder="Description"
            placeholderTextColor="#9E9E9E"
            multiline
            numberOfLines={2}
            value={point.LocationDescription}
            onChangeText={(text) => onEdit(pointIndex, "LocationDescription", text)}
          />
        </View>
      )}

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.focusButton]}
          onPress={() => onFocus(point)}
        >
          <Ionicons name="locate-outline" size={16} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Focus</Text>
        </TouchableOpacity>
        {!isViewMode && !isLivePoint && (
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => onEdit(pointIndex)}
          >
            <Ionicons name="create-outline" size={16} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  },
  postcodeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  postcodeText: {
    fontSize: 14,
  },
  descriptionContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  descriptionText: {
    flex: 1,
    fontSize: 14,
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
  saveButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    zIndex: 100,
  }
});

export default LocationCard;
