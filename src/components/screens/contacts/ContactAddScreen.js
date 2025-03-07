import Screen from "../../layout/Screen";
import ContactForm from "../../entity/contacts/ContactForm";
import { KeyboardAvoidingView } from "react-native";

const ContactAddScreen = ({ navigation, route }) => {
  // Initialisations ---------------------------------
  const { onAdd } = route.params;
  // State -------------------------------------------

  // Handlers ----------------------------------------
  const handleCancel = navigation.goBack;
  
  const handleSubmit = (contactData) => {
    onAdd(contactData);
  };

  // View --------------------------------------------
  return (
    <Screen>
      <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={100}>
        <ContactForm onSave={handleSubmit} onCancel={handleCancel} />
      </KeyboardAvoidingView>
    </Screen>
  );
};

export default ContactAddScreen;