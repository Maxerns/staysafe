import { useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Screen from "../../layout/Screen";
import { ButtonTray, Button } from "../../UI/Button.js";
import Icons from "../../UI/Icons.js";

const defaultActivity = {
  ActivityID: null,
  ActivityName: null,
  ActivityDescription: null,
  ActivityFrom: {
    LocationName: null,
    LocationAddress: null,
    LocationPostcode: null,
    LocationCoordinate: { lat: null, lng: null },
  },
  ActivityLeave: new Date().toISOString(),
  ActivityTo: {
    LocationName: null,
    LocationAddress: null,
    LocationPostcode: null,
    LocationCoordinate: { lat: null, lng: null },
  },
  ActivityETA: null,
};

const ActivityAddScreen = ({ navigation, route }) => {
  // Initialisations ---------------------------------
  const { onAdd } = route.params;
  defaultActivity.ActivityID = Math.floor(100000 + Math.random() * 900000);
  // State -------------------------------------------
  const [activity, setActivity] = useState(defaultActivity);

  // Handlers ----------------------------------------
  const handleAdd = () => {
    if (validateETA(activity.ActivityETA)) {
      onAdd(activity);
    } else {
      setError("Please enter a valid ETA.");
    }
  };
  const handleCancel = navigation.goBack;

  const handleChange = (field, value) => {
    setActivity({ ...activity, [field]: value });
    if (field === "ActivityETA") {
      setError(null);
    }
  };

  const handleFromChange = (field, value) =>
    setActivity({
      ...activity,
      ActivityFrom: {
        ...activity.ActivityFrom,
        [field]: value,
      },
    });

  const handleToChange = (field, value) =>
    setActivity({
      ...activity,
      ActivityTo: {
        ...activity.ActivityTo,
        [field]: value,
      },
    });

  const validateETA = (eta) => {
    const date = new Date(eta);
    return !isNaN(date.getTime());
  };

  // View --------------------------------------------
  return (
    <Screen>
      <KeyboardAvoidingView behavior="padding">
        <ScrollView>
          <View style={styles.item}>
            <Text style={styles.itemLabel}>Activity Name</Text>
            <TextInput
              value={activity.ActivityName}
              onChangeText={(value) => handleChange("ActivityName", value)}
              style={styles.itemInput}
            />
          </View>

          <View style={styles.item}>
            <Text style={styles.itemLabel}>Activity Description</Text>
            <TextInput
              value={activity.ActivityDescription}
              onChangeText={(value) =>
                handleChange("ActivityDescription", value)
              }
              style={styles.itemInput}
            />
          </View>

          <Text style={styles.sectionHeader}>From</Text>
          <View style={styles.item}>
            <Text style={styles.itemLabel}>Location Name</Text>
            <TextInput
              value={activity.ActivityFrom.LocationName}
              onChangeText={(value) => handleFromChange("LocationName", value)}
              style={styles.itemInput}
            />
          </View>
          <View style={styles.item}>
            <Text style={styles.itemLabel}>Location Address</Text>
            <TextInput
              value={activity.ActivityFrom.LocationAddress}
              onChangeText={(value) =>
                handleFromChange("LocationAddress", value)
              }
              style={styles.itemInput}
            />
          </View>
          <View style={styles.item}>
            <Text style={styles.itemLabel}>Location Postcode</Text>
            <TextInput
              value={activity.ActivityFrom.LocationPostcode}
              onChangeText={(value) =>
                handleFromChange("LocationPostcode", value)
              }
              style={styles.itemInput}
            />
          </View>

          <Text style={styles.sectionHeader}>To</Text>
          <View style={styles.item}>
            <Text style={styles.itemLabel}>Location Name</Text>
            <TextInput
              value={activity.ActivityTo.LocationName}
              onChangeText={(value) => handleToChange("LocationName", value)}
              style={styles.itemInput}
            />
          </View>
          <View style={styles.item}>
            <Text style={styles.itemLabel}>Location Address</Text>
            <TextInput
              value={activity.ActivityTo.LocationAddress}
              onChangeText={(value) => handleToChange("LocationAddress", value)}
              style={styles.itemInput}
            />
          </View>
          <View style={styles.item}>
            <Text style={styles.itemLabel}>Location Postcode</Text>
            <TextInput
              value={activity.ActivityTo.LocationPostcode}
              onChangeText={(value) =>
                handleToChange("LocationPostcode", value)
              }
              style={styles.itemInput}
            />
          </View>

          <View style={styles.item}>
            <Text style={styles.itemLabel}>ETA</Text>
            <TextInput
              value={activity.ActivityETA}
              onChangeText={(value) => handleChange("ActivityETA", value)}
              style={styles.itemInput}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>

          <ButtonTray>
            <Button label="Save" icon={<Icons.Add />} onClick={handleAdd} />
            <Button label="Cancel" onClick={handleCancel} />
          </ButtonTray>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  item: {
    marginVertical: 8,
  },
  itemLabel: {
    color: "grey",
    fontSize: 16,
    marginBottom: 5,
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
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 5,
    color: "#333",
  },
});

export default ActivityAddScreen;
