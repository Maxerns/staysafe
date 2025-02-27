import Screen from "../../layout/Screen.js";
import ContactForm from "../../entity/contacts/ContactForm.js";

const ContactAddScreen = ({ navigation, route }) => {
  const { onAdd } = route.params;
  
  // Prepare a default contact
  const initialContact = {
    ContactID: Math.floor(100000 + Math.random() * 900000).toString(),
    ContactUserID: "",
    ContactContactID: "",
    ContactLabel: "",
    ContactDatecreated: new Date().toISOString(),
  };

  const handleSave = (newContact) => {
    onAdd(newContact);
    navigation.goBack();
  };

  const handleCancel = navigation.goBack;

  return (
    <Screen>
      <ContactForm
        initialContact={initialContact}
        initialContactUsername={""}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </Screen>
  );
};

export default ContactAddScreen;