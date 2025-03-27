import { Alert, StyleSheet, Text, View, Image } from "react-native";
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
    <View style={styles.container}>
      {/* Contact Info Section */}
      <View style={styles.infoSection}>
        <View style={styles.avatarContainer}>
          {contact.userDetails && contact.userDetails.UserImageURL ? (
            <Image
              source={{ uri: contact.userDetails.UserImageURL }}
              style={styles.avatar}
            />
          ) : (
            <Icons.User width={40} height={40} color="#122f76" />
          )}
        </View>

        <View style={styles.contactInfoCard}>
          <Text style={styles.contactLabel}>{contact.ContactLabel}</Text>

          {contact.userDetails ? (
            <>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Username: </Text>
                <Text style={styles.infoValue}>{contact.userDetails.UserUsername}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>First Name: </Text>
                <Text style={styles.infoValue}>{contact.userDetails.UserFirstname}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Last Name: </Text>
                <Text style={styles.infoValue}>{contact.userDetails.UserLastname}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Phone: </Text>
                <Text style={styles.infoValue}>{contact.userDetails.UserPhone}</Text>
              </View>
            </>
          ) : (
            <View style={styles.infoRow}>
              <Text style={styles.infoValue}>User details not available</Text>
            </View>
          )}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Created: </Text>
            <Text style={styles.infoValue}>{formatDate(contact.ContactDatecreated)}</Text>
          </View>
        </View>
      </View>

      {/* Actions Section */}
      <ButtonTray style={styles.buttonTray}>
        <Button
          icon={<Icons.Edit />}
          label="Modify"
          onClick={onModify}
          styleButton={styles.modifyButton}
          styleLabel={styles.modifyButtonText}
        />
        <Button
          icon={<Icons.Delete />}
          label="Delete"
          styleButton={styles.deleteButton}
          styleLabel={styles.deleteButtonText}
          onClick={requestDelete}
        />
      </ButtonTray>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 25,
  },
  infoSection: {
    gap: 20,
  },
  avatarContainer: {
    alignSelf: "center",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#e8ebf2",
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
  contactInfoCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  contactLabel: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#122f76",
    textAlign: "center",
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "center",
  },
  iconWrapper: {
    width: 30,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 2,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: "#777",
    marginRight: 5,
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  buttonTray: {
    marginTop: 10,
  },
  modifyButton: {
    backgroundColor: "#122f76",
    borderColor: "#122f76",
  },
  modifyButtonText: {
    color: "white",
    fontWeight: "600",
  },
  deleteButton: {
    backgroundColor: "#fff0f0",
    borderColor: "#ffcccb",
  },
  deleteButtonText: {
    color: "#ff3b3b",
    fontWeight: "600",
  },
});

export default ContactView;
