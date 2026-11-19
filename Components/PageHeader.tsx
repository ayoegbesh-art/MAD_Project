import React, {useState} from "react-native";
import {View, Text, TouchableOpacity, Modal, Stylesheet } from "react-native";
import {router, type Href } from "expo-router";

type Props = {
    title: string;
};

export default function PageHeader({title}: Props) {
   const [menuVisible, setMenuVisible] = useState(false);

   function openPage(path: Href){
    setMenuVisible(false);
    router.puswh(path);
   }
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

