import Screen from "../../layout/Screen";
import ContactForm from "../../entity/contacts/ContactForm";
import intialUsers from "../../../data/users.js";

const ContactModifyScreen = ({ navigation, route }) => {
  // Initialisations ---------------------------------
  const { contact, onModify } = route.params;
  // State -------------------------------------------
  // Handlers ----------------------------------------
  const foundUser = intialUsers.find(
    (user) => user.UserID === contact.ContactContactID
  );
  const initialContactUsername = foundUser ? foundUser.UserUsername : "";

  const handleSave = (modifiedContact) => {
    // Keep original ContactUserID in case it wasn't included in the form
    const updatedContact = {
      ...modifiedContact,
      ContactUserID: contact.ContactUserID,
    };

    onModify(updatedContact);
  };

  const handleCancel = navigation.goBack;

  // View --------------------------------------------

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
