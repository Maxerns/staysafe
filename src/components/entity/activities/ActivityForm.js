import { useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
} from "react-native";
import Icons from "../../UI/Icons.js";
import Form from "../../UI/Form.js";

const defaultActivity = {
  ActivityID: null,
  ActivityName: null,
  ActivityDescription: null,
  ActivityFromID: null,
  ActivityLeave: new Date().toISOString(),
  ActivityToID: null,
  ActivityArrive: new Date().toISOString(),
  ActivityStatusID: 1,
};

const ActivityForm = ({ originalActivity, onSubmit, onCancel }) => {
  // Initialisations ---------------------------------
  // State -------------------------------------------
  const [activity, setActivity] = useState(originalActivity || defaultActivity);

  // Handlers ----------------------------------------

  const handleChange = (field, value) => {
    setActivity({ ...activity, [field]: value });
  };

  const handleSubmit = () => {
    onSubmit(activity);
  };

//   const validateETA = (eta) => {
//     const date = new Date(eta);
//     return !isNaN(date.getTime());
//   };

  // View --------------------------------------------
  const submitLabel = originalActivity ? "Modify" : "Add";
  const submitIcon = originalActivity ? <Icons.Edit /> : <Icons.Add />;
  return (
            <Form
                onSubmit={handleSubmit}
                onCancel={onCancel}
                submitLabel={submitLabel}
                submitIcon={submitIcon}
            >
                <Form.InputText
                    label="Activity Name"
                    value={activity.ActivityName}
                    onChange={(value) => handleChange("ActivityName", value)}
                />
                <Form.InputText
                    label="Activity Description"
                    value={activity.ActivityDescription}
                    onChange={(value) => handleChange("ActivityDescription", value)}
                />
                <Form.InputText
                    label="Activity From"
                    value={activity.ActivityFrom}
                    onChange={(value) => handleChange("ActivityFromID", value)}
                />

                <Form.InputText
                    label="Activity To"
                    value={activity.ActivityTo}
                    onChange={(value) => handleChange("ActivityToID", value)}
                />

          {/* <View style={styles.item}>
            <Text style={styles.itemLabel}>ETA</Text>
            <TextInput
              value={activity.ActivityETA}
              onChangeText={(value) => handleChange("ActivityETA", value)}
              style={styles.itemInput}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View> */}
          </Form>
  );
};

const styles = StyleSheet.create({
});

export default ActivityForm;
