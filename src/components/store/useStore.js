import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

const useStore = (key, initialRecord) => {
  // State ----------------------------
  const [record, setRecord] = useState(initialRecord);
  // Handlers -------------------------
  const loadRecord = async () => {
    try {
      const recoveredJSON = await AsyncStorage.getItem(key);
      if (recoveredJSON !== null) {
        const record = JSON.parse(recoveredJSON);
        setRecord(record);
      }
    } catch (error) {
      Alert.alert(`Error loading ${key} record: ${error}`);
    }
  };

  const saveRecord = async (newRecord) => {
    try {
      const encodedRecord = JSON.stringify(newRecord);
      await AsyncStorage.setItem(key, encodedRecord);
      setRecord(newRecord);
    } catch (error) {
      Alert.alert(`Error saving ${key} record: ${error}`);
    }
  };

  useEffect(() => {
    loadRecord();
  }, []);

  // Return ---------------------------
  return [record, saveRecord];
};

export default useStore;
