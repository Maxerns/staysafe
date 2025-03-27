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
import Checkbox from "expo-checkbox";
import { ButtonTray, Button } from "../UI/Button.js";
import Icons from "../UI/Icons.js";
import { SelectList } from "react-native-dropdown-select-list";
import DateTimePicker from "@react-native-community/datetimepicker";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { TouchableOpacity } from "react-native";
import { useTheme } from "../context/themeContext";

const Form = ({
  children,
  onSubmit,
  onCancel,
  submitLabel,
  submitIcon,
  buttonStyle,
  buttonTextStyle,
  cancelButtonStyle,
  cancelTextStyle,
  showCancelButton = true,
}) => {
  const { theme } = useTheme();
  return (
    <KeyboardAvoidingView style={[styles.formContainer, { backgroundColor: theme.card }]}>
      <ScrollView contentContainerStyle={styles.formItems}>
        {children}
      </ScrollView>
      <ButtonTray style={!showCancelButton && styles.centerButtonTray}>
        <Button
          label={submitLabel}
          icon={submitIcon}
          onClick={onSubmit}
          styleButton={[
            !showCancelButton && styles.fullWidthButton,
            buttonStyle,
          ]}
          styleLabel={buttonTextStyle}
        />
        {showCancelButton && (
          <Button
            label="Cancel"
            icon={<Icons.Close />}
            onClick={onCancel}
            styleButton={cancelButtonStyle || styles.cancelButton}
            styleLabel={cancelTextStyle || styles.cancelButtonText}
          />
        )}
      </ButtonTray>
    </KeyboardAvoidingView>
  );
};

const InputText = ({ label, value, onChange, icon, style }) => {
  const { theme } = useTheme();
  return (
    <View style={[styles.item, style]}>
      <Text style={styles.itemLabel}>{label}</Text>
      <View style={styles.inputContainer}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <TextInput
          value={value}
          onChangeText={onChange}
          style={[
            styles.itemInput,
            icon && styles.inputWithIcon,
            { backgroundColor: theme.inputBackground }
          ]}
          placeholderTextColor="#999"
        />
      </View>
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
  const { theme } = useTheme();
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
          boxStyles={{ ...styles.selectListBoxStyle, backgroundColor: theme.inputBackground }}
          dropdownStyles={styles.selectListDropdownStyle}
        />
      )}
    </View>
  );
};

const InputPassword = ({ label, value, onChange, icon, style }) => {
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[styles.item, style]}>
      <Text style={styles.itemLabel}>{label}</Text>
      <View style={styles.inputContainer}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <TextInput
          value={value}
          onChangeText={onChange}
          style={[
            styles.itemInput,
            icon && styles.inputWithIcon,
            { backgroundColor: theme.inputBackground }
          ]}
          secureTextEntry={!showPassword}
          placeholderTextColor="#999"
        />
        <TouchableOpacity
          style={styles.passwordToggle}
          onPress={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
        </TouchableOpacity>
      </View>
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
  const { theme } = useTheme();
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
        <TouchableOpacity
          onPress={openAndroidPicker}
          style={[styles.itemInput, { backgroundColor: theme.inputBackground }]}
        >
          <Text>
            {value ? new Date(value).toLocaleString() : "Select Date & Time"}
          </Text>
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
    gap: 15,
  },
  formContainer: {
    gap: 25,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  item: {
    flex: 1,
    marginBottom: 10,
  },
  itemCheckbox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  itemLabel: {
    color: "#555",
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "500",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 7,
    borderColor: "#ccc",
    backgroundColor: "white",
    overflow: "hidden",
  },
  iconContainer: {
    paddingHorizontal: 10,
  },
  passwordToggle: {
    padding: 10,
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
    flex: 1,
  },
  inputWithIcon: {
    paddingLeft: 0,
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
  cancelButton: {
    backgroundColor: "#f2f2f2",
    borderColor: "#ddd",
  },
  cancelButtonText: {
    color: "#555",
  },
  centerButtonTray: {
    justifyContent: "center",
  },
  fullWidthButton: {
    maxWidth: 250,
  },
});

export default Form;
