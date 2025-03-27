import { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Image,
  TouchableOpacity,
} from "react-native";
import Screen from "../../layout/Screen";
import Form from "../../UI/Form";
import Icons from "../../UI/Icons";
import { AuthContext } from "../../context/authContext";

const SignInScreen = ({ navigation }) => {
  // Initialisations ---------------------------------
  const { signIn } = useContext(AuthContext);
  // State -------------------------------------------
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Handlers ----------------------------------------
  const handleSignIn = async () => {
    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      await signIn({ username, password });
      // Navigation will be handled by the auth context
    } catch (error) {
      setError(error.message || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const goToSignUp = () => {
    navigation.navigate("SignUpScreen");
  };

  // View --------------------------------------------
  return (
    <Screen style={styles.screen}>
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../../../assets/StaySafeVector.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Sign In</Text>
          <Text style={styles.subtitle}>Welcome back to StaySafe</Text>
        </View>

        <Form
          onSubmit={handleSignIn}
          onCancel={() => {}}
          submitLabel={isLoading ? "Signing in..." : "Sign In"}
          submitIcon={<Icons.Submit color="white" />}
          buttonStyle={styles.submitButton}
          buttonTextStyle={styles.submitButtonText}
          showCancelButton={false}
        >
          <Form.InputText
            label="Username"
            value={username}
            onChange={setUsername}
            icon={<Icons.User />}
            style={styles.inputField}
          />
          <Form.InputPassword
            label="Password"
            value={password}
            onChange={setPassword}
            icon={<Icons.Lock />}
            style={styles.inputField}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity style={styles.forgotPasswordLink}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </Form>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <Text style={styles.linkText} onPress={goToSignUp}>
            Sign Up
          </Text>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#f8f9fa",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 200,
    height: 100,
  },
  header: {
    marginBottom: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#122f76",
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
    marginTop: 5,
  },
  formWrapper: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputField: {
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: "#122f76",
    borderColor: "#122f76",
    minWidth: 200,
  },
  submitButtonText: {
    color: "white",
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: "white",
    borderColor: "#ddd",
  },
  cancelButtonText: {
    color: "#555",
  },
  forgotPasswordLink: {
    alignSelf: "flex-end",
    marginTop: 5,
    marginBottom: 10,
  },
  forgotPasswordText: {
    color: "#122f76",
    fontSize: 14,
  },
  footer: {
    flexDirection: "row",
    marginTop: 30,
    justifyContent: "center",
  },
  footerText: {
    color: "gray",
  },
  linkText: {
    color: "#ff3b3b",
    fontWeight: "bold",
  },
  errorText: {
    color: "#ff3b3b",
    marginTop: 10,
    textAlign: "center",
  },
});

export default SignInScreen;
