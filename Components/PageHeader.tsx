import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { router, type Href } from "expo-router";

type Props = {
  title: string;
};

export default function PageHeader({ title }: Props) {
  const [menuVisible, setMenuVisible] = useState(false);

  function openPage(path: Href) {
    setMenuVisible(false);
    router.push(path);
  }

  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>

      <TouchableOpacity
        onPress={() => setMenuVisible(true)}
        style={styles.menuButton}
        accessibilityRole="button"
        accessibilityLabel="Open navigation menu"
      >
        <Text style={styles.dots}>⋮</Text>
      </TouchableOpacity>

      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menu}>
            <TouchableOpacity onPress={() => openPage("/")}>
              <Text style={styles.menuItem}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openPage("/search")}>
              <Text style={styles.menuItem}>Search Books</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openPage("/my-books")}>
              <Text style={styles.menuItem}>My Books</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openPage("/profile")}>
              <Text style={styles.menuItem}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setMenuVisible(false)}>
              <Text style={styles.closeItem}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#B08463",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { color: "#FFFFFF", fontSize: 22, fontWeight: "bold" },
  menuButton: { paddingHorizontal: 10 },
  dots: { color: "#FFFFFF", fontSize: 30, fontWeight: "bold" },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)", alignItems: "flex-end" },
  menu: {
    backgroundColor: "#F7F3ED",
    marginTop: 60,
    marginRight: 12,
    padding: 15,
    borderRadius: 8,
    minWidth: 170,
  },
  menuItem: { color: "#2E2E2E", fontSize: 16, paddingVertical: 12 },
  closeItem: { color: "#D32F2F", fontSize: 16, paddingVertical: 12 },
});


