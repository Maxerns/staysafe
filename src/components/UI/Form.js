import {
  KeyboardAvoidingView,
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  Platform,
} from "react-native";
import React, { useState } from "react";
import Checkbox from 'expo-checkbox';
import { ButtonTray, Button } from "../UI/Button.js";
import Icons from "../UI/Icons.js";
import { SelectList } from "react-native-dropdown-select-list";
import DateTimePicker from '@react-native-community/datetimepicker';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { TouchableOpacity } from "react-native";

const Form = ({ children, onSubmit, onCancel, submitLabel, submitIcon }) => {
  return (
    <KeyboardAvoidingView style={styles.formContainer}>
      <ScrollView contentContainerStyle={styles.formItems}>
        {children}
      </ScrollView>
      <ButtonTray>
        <Button label={submitLabel} icon={submitIcon} onClick={onSubmit} />
        <Button label="Cancel" icon={<Icons.Close />} onClick={onCancel} />
      </ButtonTray>
    </KeyboardAvoidingView>
  );
};

const InputText = ({ label, value, onChange }) => {
  return (
    <View style={styles.item}>
      <Text style={styles.itemLabel}>{label}</Text>
      <TextInput value={value} onChangeText={onChange} style={styles.itemInput} />
    </View>
  );
};

const InputSelect = ({
  label,
  prompt,
  options,
  value,
  onChange,
  isLoading = false,
}) => {
  const selectListData = options.map((option) => ({
    key: option.value,
    value: option.label,
  }));

  return (
    <View style={styles.item}>
      <Text style={styles.itemLabel}>{label}</Text>
      {isLoading ? (
        <View style={styles.itemLoading}>
          <Text style={styles.itemLoadingText}>Loading records ...</Text>
        </View>
      ) : (
        <SelectList
          setSelected={onChange}
          data={selectListData}
          placeholder={prompt}
          defaultOption={selectListData.find((item) => item.key === value)}
          boxStyles={styles.selectListBoxStyle}
          dropdownStyles={styles.selectListDropdownStyle}
        />
      )}
    </View>
  );
};

const InputPassword = ({ label, value, onChange }) => {
  return (
    <View style={styles.item}>
      <Text style={styles.itemLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        style={styles.itemInput}
        secureTextEntry={true}
      />
    </View>
  );
};

const InputCheckbox = ({ label, value, onChange }) => {
  return (
    <View style={styles.itemCheckbox}>
      <Text style={styles.itemLabel}>{label}</Text>
      <Checkbox value={value} onValueChange={onChange} />
    </View>
  );
};

const InputDate = ({ label, value, onChange }) => {
  // For Android, use the imperative API chaining date then time pickers.
  if (Platform.OS === "android") {
    const openAndroidPicker = () => {
      const currentDate = value ? new Date(value) : new Date();
      // Open date picker first.
      DateTimePickerAndroid.open({
        value: currentDate,
        mode: "date",
        display: "default",
        onChange: (dateEvent, selectedDate) => {
          if (dateEvent.type !== "set" || !selectedDate) {
            return; // Cancelled the date selection.
          }
          // Then open the time picker.
          DateTimePickerAndroid.open({
            value: currentDate,
            mode: "time",
            display: "default",
            onChange: (timeEvent, selectedTime) => {
              if (timeEvent.type !== "set" || !selectedTime) {
                // If user cancels time, fallback to just date.
                onChange(selectedDate.toISOString());
              } else {
                // Combine selected date and time.
                selectedDate.setHours(selectedTime.getHours());
                selectedDate.setMinutes(selectedTime.getMinutes());
                selectedDate.setSeconds(selectedTime.getSeconds());
                onChange(selectedDate.toISOString());
              }
            },
          });
        },
      });
    };

    return (
      <View style={styles.item}>
        <Text style={styles.itemLabel}>{label}</Text>
        <TouchableOpacity onPress={openAndroidPicker} style={styles.itemInput}>
        <Text>{value ? new Date(value).toLocaleString() : "Select Date & Time"}</Text>
        </TouchableOpacity>
      </View>
    );
  } else {
    // iOS and others use the component approach.
    const [show, setShow] = useState(false);
    const dateValue = value ? new Date(value) : new Date();
    return (
      <View style={styles.item}>
      <Text style={styles.itemLabel}>{label}</Text>
        <DateTimePicker
        value={dateValue}
        mode="datetime"
        display="default"
        onChange={(event, selectedDate) => {
          setShow(false);
          if (selectedDate) {
          onChange(selectedDate.toISOString());
          }
        }}
        />
      </View>
    );
  }
};

// Compose components
Form.InputText = InputText;
Form.InputSelect = InputSelect;
Form.InputPassword = InputPassword;
Form.InputCheckbox = InputCheckbox;
Form.InputDate = InputDate;

const styles = StyleSheet.create({
  formItems: {
    gap: 5,
  },
  formContainer: {
    gap: 10,
  },
  item: {
    flex: 1,
  },
  itemCheckbox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  itemLabel: {
    color: "grey",
    fontSize: 16,
    marginBottom: 5,
  },
  itemLoading: {
    height: 50,
    backgroundColor: "mistyrose",
    justifyContent: "center",
    paddingLeft: 10,
    borderRadius: 7,
  },
  itemLoadingText: {
    fontSize: 16,
    color: "grey",
  },
  itemInput: {
    height: 50,
    paddingLeft: 10,
    fontSize: 16,
    backgroundColor: "white",
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "lightgrey",
  },
  selectListBoxStyle: {
    height: 50,
    backgroundColor: "whitesmoke",
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "lightgrey",
    paddingLeft: 10,
    paddingTop: 15,
  },
  selectListDropdownStyle: {
    borderColor: "lightgrey",
  },
});

export default Form;