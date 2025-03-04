import { useState, useContext } from "react";
import { StyleSheet, Text, View, KeyboardAvoidingView } from "react-native";
import Screen from "../../layout/Screen";
import Form from "../../UI/Form";
import Icons from "../../UI/Icons";
import { AuthContext } from "../../context/authContext";

const SignInScreen = ({ navigation }) => {
  // Initialisations ---------------------------------
  // State -------------------------------------------
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useContext(AuthContext);

  // Handlers ----------------------------------------
  const handleSignIn = async () => {


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
    <Screen>
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Sign In</Text>
          <Text style={styles.subtitle}>Welcome back to StaySafe</Text>
        </View>

        <Form
          onSubmit={handleSignIn}
          onCancel={() => {}}
          submitLabel={isLoading ? "Signing in..." : "Sign In"}
          submitIcon={<Icons.Submit />}
        >
          <Form.InputText
            label="Username"
            value={username}
            onChange={setUsername}
          />
          <Form.InputPassword
            label="Password"
            value={password}
            onChange={setPassword}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
  container: {
    flex: 1,
    justifyContent: "center",
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
    marginTop: 5,
  },
  footer: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "center",
  },
  footerText: {
    color: "gray",
  },
  linkText: {
    color: "black",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
});

export default SignInScreen;
