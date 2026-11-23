import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import PageHeader from "../Components/PageHeader";


export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <PageHeader title="ConnectLibrary" />

      <View style={styles.content}>
        <Text style={styles.title}>ConnectLibrary</Text>
        <Text style={styles.welcome}>Welcome!</Text>
        <Text style={styles.description}>
          Find your favourite books, check availability, and borrow them easily.
        </Text>

        <Pressable
          style={styles.button}
          onPress={() => router.push("/search")}
        >
          <Text style={styles.buttonText}>Search Books</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => router.push("/my-books")}
        >
          <Text style={styles.secondaryText}>My Borrowed Books</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F3ED" },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: { fontSize: 30, fontWeight: "bold", color: "#B08463" },
  welcome: { fontSize: 22, color: "#2E2E2E", marginTop: 16 },
  description: {
    fontSize: 16,
    color: "#2E2E2E",
    textAlign: "center",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#B08463",
    padding: 15,
    marginTop: 25,
    borderRadius: 8,
    minWidth: 200,
    alignItems: "center",
  },
  buttonText: { color: "#FFFFFF", fontSize: 18, fontWeight: "bold" },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#B08463",
    padding: 14,
    marginTop: 12,
    borderRadius: 8,
    minWidth: 200,
    alignItems: "center",
  },
  secondaryText: { color: "#B08463", fontSize: 16, fontWeight: "bold" },
});

