import Screen from "../../layout/Screen";
import ActivityView from "../../entity/activities/ActivityView";

const ActivityViewScreen = ({ navigation, route }) => {
  // Initialisations ---------------------------------
  const { activity, onDelete, onModify } = route.params;
  // State -------------------------------------------
  // Handlers ----------------------------------------
  const goToModifyScreen = () => navigation.navigate('ActivityModifyScreen', { activity, onModify });
  // View --------------------------------------------
  return (
    <Screen>
        <ActivityView activity={activity} onDelete={onDelete} onModify={goToModifyScreen} />
    </Screen>
  );
}

export default ActivityViewScreen;
