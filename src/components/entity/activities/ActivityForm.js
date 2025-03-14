import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Icons from "../../UI/Icons.js";
import Form from "../../UI/Form.js";
import { Button } from "../../UI/Button";

const defaultActivity = {
  ActivityID: null,
  ActivityName: "",
  ActivityDescription: "",
  ActivityLeave: "",
  ActivityArrive: "",
};

const ActivityForm = ({ originalActivity, onSubmit, onCancel, navigation, initialLocations }) => {  // Initialisations ---------------------------------
  // State -------------------------------------------
  const [activity, setActivity] = useState(originalActivity || defaultActivity);
  const [locations, setLocations] = useState(initialLocations || [null, null]);
  const [errors, setErrors] = useState({});
  // Handlers ----------------------------------------
  useEffect(() => {
    if (initialLocations) {
      setLocations(initialLocations);
    }
  }, [initialLocations]);

  const handleChange = (field, value) => {
    setActivity({ ...activity, [field]: value });
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    if (!activity.ActivityName) {
      newErrors.ActivityName = "Activity Name is required";
      valid = false;
    }

    if (!activity.ActivityDescription) {
      newErrors.ActivityDescription = "Activity Description is required";
      valid = false;
    }

    if (!activity.ActivityLeave) {
      newErrors.ActivityLeave = "Leave Date is required";
      valid = false;
    }

    if (!activity.ActivityArrive) {
      newErrors.ActivityArrive = "Arrive Date is required";
      valid = false;
    }

    if (!locations[0]) {
      newErrors.locationFrom = "From Location is required";
      valid = false;
    }

    if (!locations[1]) {
      newErrors.locationTo = "To Location is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({ ...activity, ...{ locations } });
    }
  };

  const handleSelectLocations = () => {
    navigation.navigate("MapLocationSelectionScreen", {
      locations: locations,
      onLocationsSelected: (newLocations) => setLocations(newLocations),
    });
  };

  const submitLabel = originalActivity ? "Modify" : "Add";
  const submitIcon = originalActivity ? <Icons.Edit /> : <Icons.Add />;

  return (
    <Form
      onSubmit={handleSubmit}
      onCancel={onCancel}
      submitLabel={submitLabel}
      submitIcon={submitIcon}
    >
      <View>
        <Button
          label={
            locations[0] && locations[1]
              ? "Change Locations"
              : "Select Locations"
          }
          onClick={handleSelectLocations}
        />
        {errors.locationFrom || errors.locationTo ? (
          <Text style={styles.errorText}>
            {errors.locationFrom || errors.locationTo}
          </Text>
        ) : null}
        {locations[0] && locations[1] && (
          <View style={styles.locationInfo}>
            <Text>From: {locations[0]?.LocationAddress || "No address"}</Text>
            <Text>To: {locations[1]?.LocationAddress || "No address"}</Text>
          </View>
        )}
      </View>
      <Form.InputText
        label="Activity Name"
        value={activity.ActivityName}
        onChange={(value) => handleChange("ActivityName", value)}
      />
      {errors.ActivityName ? (
        <Text style={styles.errorText}>{errors.ActivityName}</Text>
      ) : null}
      <Form.InputText
        label="Activity Description"
        value={activity.ActivityDescription}
        onChange={(value) => handleChange("ActivityDescription", value)}
      />
      {errors.ActivityDescription ? (
        <Text style={styles.errorText}>{errors.ActivityDescription}</Text>
      ) : null}
      <Form.InputDate
        label="Leave at"
        value={activity.ActivityLeave}
        onChange={(value) => handleChange("ActivityLeave", value)}
      />
      {errors.ActivityLeave ? (
        <Text style={styles.errorText}>{errors.ActivityLeave}</Text>
      ) : null}
      <Form.InputDate
        label="Arrive at"
        value={activity.ActivityArrive}
        onChange={(value) => handleChange("ActivityArrive", value)}
      />
      {errors.ActivityArrive ? (
        <Text style={styles.errorText}>{errors.ActivityArrive}</Text>
      ) : null}
    </Form>
  );
};

const styles = StyleSheet.create({
  locationInfo: {
    marginTop: 10,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
});

export default ActivityForm;
