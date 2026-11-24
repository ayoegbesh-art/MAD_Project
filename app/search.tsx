import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import PageHeader from "../components/PageHeader";

type Book = {
  id: string;
  title: string;
  author: string;
  genre?: string;
  available: boolean;
};

const BOOK_TYPES = ["All", "Fiction", "Programming", "History", "Science", "Biography"];

export default function SearchScreen() {
  const [searchText, setSearchText] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBooks() {
      try {
        const snapshot = await getDocs(collection(db, "books"));
        const bookList = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        })) as Book[];
        setBooks(bookList);
      } catch (error) {
        console.log("Error loading books:", error);
      } finally {
        setLoading(false);
      }
    }
    loadBooks();
  }, []);

  const matchingBooks = books.filter((book) => {
    const matchesType =
      selectedType === "All" ||
      (book.genre || "").toLowerCase() === selectedType.toLowerCase();

    const matchesQuery = (
      book.title +
      " " +
      book.author +
      " " +
      (book.genre || "")
    )
      .toLowerCase()
      .includes(searchText.toLowerCase());

    return matchesType && matchesQuery;
  });

  return (
    <View style={styles.container}>
      <PageHeader title="Search Books" />
      <View style={styles.body}>
        <TextInput
          style={styles.input}
          placeholder="Search by title, author, or book type..."
          value={searchText}
          onChangeText={setSearchText}
        />

        {/* Book Type Filter Buttons */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.typeRow}
          contentContainerStyle={styles.typeRowContent}
        >
          {BOOK_TYPES.map((type) => {
            const active = selectedType === type;
            return (
              <Pressable
                key={type}
                style={[styles.typeChip, active && styles.typeChipActive]}
                onPress={() => setSelectedType(type)}
              >
                <Text style={[styles.typeText, active && styles.typeTextActive]}>
                  {type}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {loading ? (
          <Text>Loading books...</Text>
        ) : (
          <FlatList
            data={matchingBooks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable
                style={styles.bookCard}
                onPress={() =>
                  router.push({ pathname: "/book-details", params: { id: item.id } })
                }
              >
                <Text style={styles.bookTitle}>{item.title}</Text>
                <Text style={styles.author}>{item.author}</Text>
                {item.genre ? (
                  <Text style={styles.genreBadge}>Type: {item.genre}</Text>
                ) : null}
                <Text
                  style={[
                    styles.status,
                    { color: item.available ? "#2E7D32" : "#D32F2F" },
                  ]}
                >
                  {item.available ? "Available" : "On loan"}
                </Text>
              </Pressable>
            )}
            ListEmptyComponent={<Text>No matching books found.</Text>}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F3ED" },
  body: { flex: 1, padding: 20 },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  typeRow: { maxHeight: 44, marginBottom: 14 },
  typeRowContent: { gap: 8, alignItems: "center" },
  typeChip: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#B08463",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  typeChipActive: { backgroundColor: "#B08463" },
  typeText: { color: "#B08463", fontWeight: "bold", fontSize: 13 },
  typeTextActive: { color: "#FFFFFF" },
  bookCard: {
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
  },
  bookTitle: { fontSize: 18, fontWeight: "bold", color: "#2E2E2E" },
  author: { fontSize: 15, color: "#555555", marginTop: 2 },
  genreBadge: { fontSize: 13, color: "#B08463", fontWeight: "bold", marginTop: 4 },
  status: { fontSize: 14, fontWeight: "bold", marginTop: 6 },
});