import { Text } from "react-native";
import Screen from "../../layout/Screen";
import ContactForm from "../../entity/contacts/ContactForm";
import intialUsers from "../../../data/users.js";

const ContactModifyScreen = ({ navigation, route }) => {
  // Expect route.params to include the contact to modify and onModify callback
  const { contact, onModify } = route.params;

  // Look up the current username by the contact’s reference id
  const foundUser = intialUsers.find(
    (user) => user.UserID === contact.ContactContactID
  );
  const initialContactUsername = foundUser ? foundUser.UserUsername : "";

  const handleSave = (modifiedContact) => {
    onModify(modifiedContact);
    navigation.goBack();
  };

  const handleCancel = navigation.goBack;

  return (
    <Screen>
      <ContactForm
        initialContact={contact}
        initialContactUsername={initialContactUsername}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </Screen>
  );
};

export default ContactModifyScreen;