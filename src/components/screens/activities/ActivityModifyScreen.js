import { Text } from "react-native";
import Screen from "../../layout/Screen";
import ActivityForm from "../../entity/activities/ActivityForm";


const ActivityModifyScreen = ({ navigation, route }) => {
  // Initialisations ---------------------------------
  const { activity, onModify } = route.params;
  // State -------------------------------------------
  // Handlers ----------------------------------------
  const handleCancel = navigation.goBack;
  // View --------------------------------------------
  return (
    <Screen>
      <ActivityForm originalActivity={activity} onSubmit={onModify} onCancel={handleCancel} />
    </Screen>
  );
}

export default ActivityModifyScreen;
