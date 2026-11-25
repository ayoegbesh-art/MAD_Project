import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import { auth } from "../firebase";
import PageHeader from "../Components/PageHeader";

export default function ProfileScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserEmail(user?.email ?? null);
    });

    return unsubscribe;
  }, []);

  async function handleRegister() {
    if (!email.trim() || !password) {
      setMessage("Please enter your email and password.");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      setMessage("Account created successfully!");
      setPassword("");
    } catch (error: any) {
      setMessage(error.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin() {
    if (!email.trim() || !password) {
      setMessage("Please enter your email and password.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      setMessage("Logged in successfully!");
      setPassword("");
    } catch (error: any) {
      setMessage(error.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    setLoading(true);
    setMessage("");

    try {
      await signOut(auth);
      setMessage("Signed out successfully.");
      setPassword("");
    } catch (error: any) {
      setMessage(error.message || "Logout failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <PageHeader title="Profile" />

      <View style={styles.body}>
        {userEmail ? (
          <>
            <Text style={styles.heading}>My Profile</Text>

            <Text style={styles.welcome}>
              Signed in as:
            </Text>

            <Text style={styles.email}>{userEmail}</Text>

            <Pressable
              style={styles.button}
              onPress={handleLogout}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Log Out</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Text style={styles.heading}>Member Account</Text>

            <TextInput
              style={styles.input}
              placeholder="Email address"
              autoCapitalize="none"
              keyboardType="email-address"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
            />

            <TextInput
              style={styles.input}
              placeholder="Password (min 6 characters)"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <Pressable
              style={styles.button}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Log In</Text>
            </Pressable>

            <Pressable
              style={styles.secondaryButton}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.secondaryText}>
                Create Account
              </Text>
            </Pressable>
          </>
        )}

        {loading && (
          <ActivityIndicator
            size="large"
            color="#B08463"
            style={{ marginTop: 15 }}
          />
        )}

        {message ? (
          <Text style={styles.feedback}>{message}</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F3ED",
  },
  body: {
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E2E2E",
    marginBottom: 14,
  },
  welcome: {
    fontSize: 16,
    color: "#555555",
  },
  email: {
    fontSize: 18,
    color: "#2E2E2E",
    marginBottom: 16,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#B08463",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#B08463",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  secondaryText: {
    color: "#B08463",
    fontSize: 16,
    fontWeight: "bold",
  },
  feedback: {
    marginTop: 14,
    fontSize: 14,
    color: "#2E7D32",
    fontWeight: "bold",
  },
});
