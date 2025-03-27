import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/themeContext";

const ContactItem = ({ contact, onSelect }) => {
  // Initialisations ---------------------------------
  const { theme } = useTheme();
  // State -------------------------------------------
  // Handlers ----------------------------------------
  // View --------------------------------------------
  return (
    <Pressable
      key={contact.ContactID}
      onPress={() => onSelect(contact)}
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: theme.card },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.itemContent}>
        <View style={styles.iconContainer}>
          {contact.userDetails && contact.userDetails.UserImageURL ? (
            <Image
              source={{ uri: contact.userDetails.UserImageURL }}
              style={styles.avatar}
            />
          ) : (
            <Icons.User width={40} height={40} color="#122f76" />
          )}
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.name, { color: theme.text }]}>
            {contact.ContactLabel}
          </Text>
          {contact.ContactNotes && (
            <Text style={styles.notes} numberOfLines={1}>
              {contact.ContactNotes}
            </Text>
          )}
        </View>
        <View style={styles.chevron}>
          <Text style={styles.chevronText}>
            <Ionicons name="chevron-forward" size={16} color={theme.text} />
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,

    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    overflow: "hidden",
  },
  item: {
    borderRadius: 8,
    marginVertical: 6,
    backgroundColor: "white",
    overflow: "hidden",
  },
  itemPressed: {
    backgroundColor: "#f0f4ff",
    opacity: 0.9,
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#eef1f8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 40,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  notes: {
    fontSize: 14,
    color: "#777",
    marginTop: 2,
  },
  chevron: {
    paddingHorizontal: 8,
  },
  chevronText: {
    fontSize: 22,
    color: "#122f76",
    fontWeight: "bold",
  },
});

export default ContactItem;
