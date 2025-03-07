import Screen from "../../layout/Screen";
import ActivityForm from "../../entity/activities/ActivityForm";
import { KeyboardAvoidingView, ScrollView } from "react-native";

const ActivityAddScreen = ({ navigation, route }) => {
  // Initialisations ---------------------------------
  const { onAdd } = route.params;
  // State -------------------------------------------

  // Handlers ----------------------------------------
  const handleCancel = navigation.goBack;

  // View --------------------------------------------
  return (
    <Screen>
      <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={100}>
        <ActivityForm onSubmit={onAdd} onCancel={handleCancel} />
      </KeyboardAvoidingView>
    </Screen>
  );
};

export default ActivityAddScreen;
