import {
  KeyboardAvoidingView,
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
} from "react-native";
import Checkbox from 'expo-checkbox';
import { ButtonTray, Button } from "../UI/Button.js";
import Icons from "../UI/Icons.js";
import { SelectList } from "react-native-dropdown-select-list";

const Form = ({ children, onSubmit, onCancel, submitLabel, submitIcon }) => {
  // Initialisations ---------------------------------
  // State -------------------------------------------
  // Handlers ----------------------------------------
  // View --------------------------------------------
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
  // Initialisations ---------------------------------
  // State -------------------------------------------
  // Handlers ----------------------------------------
  // View --------------------------------------------
  return (
    <View style={styles.item}>
      <Text style={styles.itemLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        style={styles.itemInput}
      />
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
          boxStyles={styles.selectListBoxStyle} // style for the select list box
          dropdownStyles={styles.selectListDropdownStyle} // style for the dropdown items
        />
      )}
    </View>
  );
};

const InputPassword = ({ label, value, onChange }) => {
  // Initialisations ---------------------------------
  // State -------------------------------------------
  // Handlers ----------------------------------------
  // View --------------------------------------------
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
}

const InputCheckbox = ({ label, value, onChange }) => {
  // Initialisations ---------------------------------
  // State -------------------------------------------
  // Handlers ----------------------------------------
  // View --------------------------------------------
  return (
    <View style={styles.itemCheckbox}>
      <Text style={styles.itemLabel}>{label}</Text>
      <Checkbox value={value} onValueChange={onChange} />
    </View>
  );
};

//compose components
Form.InputText = InputText;
Form.InputSelect = InputSelect;
Form.InputPassword = InputPassword;
Form.InputCheckbox = InputCheckbox;

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
