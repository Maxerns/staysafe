import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { useTheme } from "../context/themeContext";


const Screen = ({children}) => {
  // Initialisations ---------------------------------
  const { theme } = useTheme();
  // State -------------------------------------------
  // Handlers ----------------------------------------
  // View --------------------------------------------
  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      {children}
      <StatusBar style='light' />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: 34,
    padding: 15,
    flex: 1,

  },
});

export default Screen;
