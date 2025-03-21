import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./src/components/navigation/StackNavigator";
import { AuthProvider } from "./src/components/context/authContext";
import { ActivityProvider } from "./src/components/context/activityContext";
import { ContactProvider } from "./src/components/context/contactContext";
import { ThemeProvider } from "./src/components/context/themeContext";

const App = () => {
  // Initialisations ---------------------------------
  // State -------------------------------------------
  // Handlers ----------------------------------------
  // View --------------------------------------------
  return (
    <ThemeProvider>
      <AuthProvider>
        <ContactProvider>
          <ActivityProvider>
            <NavigationContainer>
              <StackNavigator />
            </NavigationContainer>
          </ActivityProvider>
        </ContactProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
