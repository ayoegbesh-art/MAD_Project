import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from "react-native";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth } from "../firebase";
import PageHeader from "../Components/PageHeader";

export default function ProfileScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [userEmail, setUserEmail] = useState<string | null>(
    auth.currentUser?.email ?? null
  );

  const [message, setMessage] = useState("");

  async function handleRegister() {
    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      setUserEmail(cred.user.email);
      setMessage("Account created!");
    } catch (error: any) {
      setMessage(error.message || "Registration failed.");
    }
  }

  async function handleLogin() {
    try {
      const cred = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      setUserEmail(cred.user.email);
      setMessage("Logged in successfully!");
    } catch (error: any) {
      setMessage(error.message || "Login failed.");
    }
  }

  async function handleLogout() {
    try {
      await signOut(auth);
      setUserEmail(null);
      setMessage("Signed out.");
    } catch (error: any) {
      setMessage(error.message || "Logout failed.");
    }
  }

  return (
    <View style={styles.container}>
      <PageHeader title="Profile" />

      <View style={styles.body}>
        {userEmail ? (
          <>
            <Text style={styles.welcome}>
              Signed in as: {userEmail}
            </Text>

            <Pressable
              style={styles.button}
              onPress={handleLogout}
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
            >
              <Text style={styles.buttonText}>Log In</Text>
            </Pressable>

            <Pressable
              style={styles.secondaryButton}
              onPress={handleRegister}
            >
              <Text style={styles.secondaryText}>
                Create Account
              </Text>
            </Pressable>
          </>
        )}

        {message ? (
          <Text style={styles.feedback}>{message}</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: "#F7F3ED"},
    body: {padding: 20},
    heading: {fontSize: 24, fontWeight: "bold", color: "#2E2E2E", marginBottom: 14},
    welcome: {fontSize: 18, color: "#2E2E2E", marginBottom: 16},
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
    buttonText: {color: "#FFFFFF", fontSize: 16, fontWeight: "bold"},
    secondaryButton: {
        borderWidth: 1,
        borderColor: "#B08463",
        padding: 14,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10,
    },
    secondaryText: {color: "#B08463", fontSize: 16, fontWeight: "bold"},
    feedback: {marginTop: 14, fontSize: 15, color: "#2E7D32", fontWeight: "bold"},
});

