import { Alert, StyleSheet, Text, View } from "react-native";
import { Button, ButtonTray } from "../../UI/Button";
import Icons from "../../UI/Icons.js";

const ContactView = ({ contact, onDelete, onModify }) => {
  // Initialisations ---------------------------------
  // State -------------------------------------------
  // Handlers ----------------------------------------
  const handleDelete = () => onDelete(contact);

  const requestDelete = () =>
    Alert.alert(
      "Delete Contact",
      `Are you sure that you want to delete contact "${contact.ContactLabel}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: handleDelete },
      ]
    );

  // View --------------------------------------------

  return (
    <View style={styles.container}>
      <View style={styles.infoTray}>
        <Text style={styles.boldText}>Label: {contact.ContactLabel}</Text>
        <Text style={styles.text}>Contact ID: {contact.ContactID}</Text>
        <Text style={styles.text}>User ID: {contact.ContactUserID}</Text>
        <Text style={styles.text}>
          Contact Reference ID: {contact.ContactContactID}
        </Text>
        <Text style={styles.text}>
          Created: {new Date(contact.ContactDatecreated).toLocaleString()}
        </Text>
      </View>
      <ButtonTray>
        <Button icon={<Icons.Edit />} label="Modify" onClick={onModify} />
        <Button
          icon={<Icons.Delete />}
          label="Delete"
          styleButton={{ backgroundColor: "mistyrose" }}
          styleLabel={{ color: "red" }}
          onClick={requestDelete}
        />
      </ButtonTray>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 15,
  },
  infoTray: {
    gap: 5,
  },
  boldText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  text: {
    fontSize: 16,
  },
});

export default ContactView;
