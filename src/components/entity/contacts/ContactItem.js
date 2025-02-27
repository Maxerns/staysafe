import { StyleSheet, Text, View, Pressable } from "react-native";

const ContactItem = ({contact, onSelect}) => {
  // Initialisations ---------------------------------
  // State -------------------------------------------
  // Handlers ----------------------------------------
  // View --------------------------------------------
  return (
    <Pressable key={contact.ContactID} onPress={() => onSelect(contact)}>
    <View style={styles.item}>
      <Text style={styles.text}>
        {contact.ContactID} {contact.ContactName}
      </Text>
    </View>
  </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    paddingVertical: 15,
    borderTopWidth: 1,
    borderColor: "lightgrey",
  },
  text: {
    fontSize: 16,
  },
});

export default ContactItem;