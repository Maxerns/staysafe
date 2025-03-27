import { Alert, StyleSheet, Text, View, Image } from "react-native";
import { Button, ButtonTray } from "../../UI/Button";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/themeContext.js";

const ContactView = ({ contact, onDelete, onModify }) => {
  // Initialisations ---------------------------------
  const { theme } = useTheme();
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

  // Format the date in a more readable way
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // View --------------------------------------------
  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      <View>
        <View style={styles.avatarContainer}>
          {contact.userDetails && contact.userDetails.UserImageURL ? (
            <Image
              source={{ uri: contact.userDetails.UserImageURL }}
              style={styles.avatar}
            />
          ) : (
            <Ionicons name="person" size={40} color={theme.primary} />
          )}
        </View>

        <Text style={[styles.contactLabel, { color: theme.primary }]}>{contact.ContactLabel}</Text>

        {contact.userDetails ? (
          <>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.text }]}>Username: </Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>
                {contact.userDetails.UserUsername}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.text }]}>First Name: </Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>
                {contact.userDetails.UserFirstname}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.text }]}>Last Name: </Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>
                {contact.userDetails.UserLastname}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.text }]}>Phone: </Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>
                {contact.userDetails.UserPhone}
              </Text>
            </View>
          </>
        ) : (
          <View style={styles.infoRow}>
            <Text style={[styles.infoValue, { color: theme.text }]}>User details not available</Text>
          </View>
        )}
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: theme.text }]}>Created: </Text>
          <Text style={[styles.infoValue, { color: theme.text }]}>
            {formatDate(contact.ContactDatecreated)}
          </Text>
        </View>
      </View>

      <ButtonTray style={styles.buttonTray}>
        <Button
          icon={<Ionicons name="create-outline" size={16} color="white" />}
          label="Modify"
          onClick={onModify}
          styleButton={{ backgroundColor: theme.primary }}
          styleLabel={{ color: theme.buttonText }}
        />
        <Button
          icon={<Ionicons name="trash-outline" size={16} color="white" />}
          label="Delete"
          styleButton={{ backgroundColor: theme.error }}
          styleLabel={{ color: theme.buttonText }}
          onClick={requestDelete}
        />
      </ButtonTray>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    gap: 25,
    backgroundColor: "white",
    padding: 16,
  },
  avatarContainer: {
    alignSelf: "center",
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  contactLabel: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "center",
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    marginRight: 5,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "500",
  },
});

export default ContactView;
