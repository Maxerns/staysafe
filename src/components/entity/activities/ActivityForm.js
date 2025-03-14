
import React, { useState } from "react";
import {StyleSheet} from "react-native";
import Icons from "../../UI/Icons.js";
import Form from "../../UI/Form.js";

const defaultActivity = {
  ActivityID: null,
  ActivityName: "",
  ActivityDescription: "",
  ActivityLeave: "",
  ActivityArrive: "",
};

const ActivityForm = ({ originalActivity, onSubmit, onCancel }) => {
  const [activity, setActivity] = useState(originalActivity || defaultActivity);

  const handleChange = (field, value) => {
    setActivity({ ...activity, [field]: value });
  };

  const handleSubmit = () => {
    onSubmit(activity);
  };

  const submitLabel = originalActivity ? "Modify" : "Add";
  const submitIcon = originalActivity ? <Icons.Edit /> : <Icons.Add />;
  
  return (
    <Form onSubmit={handleSubmit} onCancel={onCancel} submitLabel={submitLabel} submitIcon={submitIcon}>
      <Form.InputText 
        label="Activity Name" 
        value={activity.ActivityName} 
        onChange={(value)=> handleChange("ActivityName", value)} 
      />
      <Form.InputText 
        label="Activity Description" 
        value={activity.ActivityDescription} 
        onChange={(value)=> handleChange("ActivityDescription", value)} 
      />
      <Form.InputDate 
        label="Leave at" 
        value={activity.ActivityLeave} 
        onChange={(value)=> handleChange("ActivityLeave", value)} 
      />
      <Form.InputDate 
        label="Arrive at" 
        value={activity.ActivityArrive} 
        onChange={(value)=> handleChange("ActivityArrive", value)} 
      />
    </Form>
  );
};

const styles = StyleSheet.create({
});

export default ActivityForm;
