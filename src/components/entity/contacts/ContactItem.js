import { StyleSheet, Text, View, Pressable } from "react-native";
import Icons from "../../UI/Icons";

const ContactItem = ({ contact, onSelect }) => {
  // Initialisations ---------------------------------
  // State -------------------------------------------
  // Handlers ----------------------------------------
  // View --------------------------------------------
  return (
    <Pressable
      key={contact.ContactID}
      onPress={() => onSelect(contact)}
      style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
    >
      <View style={styles.itemContent}>
        <View style={styles.iconContainer}>
          <Icons.User />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.name}>{contact.ContactLabel}</Text>
          {contact.ContactNotes && (
            <Text style={styles.notes} numberOfLines={1}>
              {contact.ContactNotes}
            </Text>
          )}
        </View>
        <View style={styles.chevron}>
          <Text style={styles.chevronText}>›</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
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
