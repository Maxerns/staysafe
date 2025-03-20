import { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Image,
  ScrollView,
} from "react-native";
import Screen from "../../layout/Screen";
import Form from "../../UI/Form";
import Icons from "../../UI/Icons";
import { AuthContext } from "../../context/authContext";

const SignUpScreen = ({ navigation }) => {
  // Initialisations ---------------------------------
  const { signUp } = useContext(AuthContext);
  // State -------------------------------------------
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Handlers ----------------------------------------
  const handleSignUp = async () => {
    // Validate fields
    if (!firstName || !lastName || !phone || !username || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (phone.length < 12) {
      setError("Please enter a valid phone number");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await signUp({
        UserFirstname: firstName,
        UserLastname: lastName,
        UserPhone: phone,
        UserUsername: username,
        UserPassword: password,
      });
      // Navigation will be handled by auth context
    } catch (error) {
      setError(error.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  const goToSignIn = () => {
    navigation.navigate("SignInScreen");
  };

  // View --------------------------------------------
  return (
    <Screen style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../../../../assets/StaySafeVector.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Join StaySafe and stay protected
            </Text>
          </View>

          <View style={styles.formWrapper}>
            <Form
              onSubmit={handleSignUp}
              onCancel={goToSignIn}
              submitLabel={isLoading ? "Creating account..." : "Sign Up"}
              submitIcon={<Icons.Submit color="white" />}
              buttonStyle={styles.submitButton}
              buttonTextStyle={styles.submitButtonText}
              cancelButtonStyle={styles.cancelButton}
              cancelTextStyle={styles.cancelButtonText}
            >
              <Form.InputText
                label="First Name"
                value={firstName}
                onChange={setFirstName}
                icon={<Icons.User />}
                style={styles.inputField}
              />
              <Form.InputText
                label="Last Name"
                value={lastName}
                onChange={setLastName}
                icon={<Icons.User />}
                style={styles.inputField}
              />
              <Form.InputText
                label="Phone Number"
                value={phone}
                onChange={setPhone}
                icon={<Icons.Phone />}
                style={styles.inputField}
              />
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
              <Form.InputPassword
                label="Confirm Password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                icon={<Icons.Lock />}
                style={styles.inputField}
              />
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
            </Form>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Text style={styles.linkText} onPress={goToSignIn}>
              Sign In
            </Text>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#f8f9fa",
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 30,
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

export default SignUpScreen;
