import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/themeContext';

// Define constants that were previously imported from ActivityMapScreen
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH * 0.8;
const CARD_SPACING = 10;

const LocationCard = ({ 
  point, 
  pointIndex, 
  isViewMode = false,
  onFocus,
  onEdit,
  onRemove
}) => {
  const { theme, isDarkMode } = useTheme();
  
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
            onPress={() => onRemove && onRemove(pointIndex)}
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

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.focusButton,
            { backgroundColor: isDarkMode ? "#455A64" : "#607D8B" },
          ]}
          onPress={() => onFocus && onFocus(point)}
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
            onPress={() => onEdit && onEdit(pointIndex)}
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

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    marginHorizontal: CARD_SPACING / 2,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyCard: {
    opacity: 0.8,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  pointBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  pointBadgeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
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
    marginLeft: 6,
    flex: 1,
    fontSize: 14,
  },
  postcodeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  postcodeText: {
    marginLeft: 6,
    fontSize: 14,
  },
  emptyCardContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  emptyCardText: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 14,
  },
  cardActions: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    flex: 1,
    marginHorizontal: 4,
  },
  focusButton: {
    marginRight: 4,
  },
  editButton: {
    marginLeft: 4,
  },
  actionButtonText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default LocationCard;
