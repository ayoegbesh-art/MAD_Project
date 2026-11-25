import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import PageHeader from "../Components/PageHeader";

type BookDetail = {
  title: string;
  author: string;
  description?: string;
  available: boolean;
  deliveryMethod?: string;
  dueDate?: string;
  reservedBy?: string;
  reservationFee?: number;
};

const RESERVATION_FEE = 5.00; 

export default function  BookDetailsScreen() {
    const {id} = useLocalSearchParams<{ id: string}>();
    const [book, setBook] = useState<BookDetail | null>(null);
    const [deliveryMethod, setDeliveryMethod] = useState<"Library Pickup" | "Home Delivery">("Library Pickup");
    const [loading, setLoading] = useState(true);

    useEffect(() =>  {
        async function fetchBook() {
            if (!id) return;
            try {
                const snap = await getDoc(doc(db, "books", id));
                if (snap.exists()) {
                  setBook(snap.data() as BookDetail);
                }
        } catch (error) {
          console.log("Error loading book details:", error);
        } finally {
            setLoading(false);
        }
            
        }
        fetchBook ();
    },   [id]);
}

function getsevenDayDueDate(): string {
    const due = new Date();
    due.setDate(due.getDate() + 7);
    return due.toISOString().spilt("T")[0];
}

async function handleBorrow() {
  if (!id|| !book) return;
  const dueDate = getsevenDayDueDate();
  try {
    await updateDoc(doc(db, "books", id), {
        available: false,
        deliveryMethod: deliveryMethod,
        borrowedBy: auth.currentUser?.email || "guest@connectlibrary.ie",
        dueDate: dueDate,
    });
    setBook({...book, available: false, deliveryMethod, dueDate});
    alert("Book borrowed via" + deliveryMethod + "! Due  back on" + dueDate + ".");
}   catch (error) {
    alert("Could not borrow book.");
    console.log(error);
}

}

async function handleReserve() {
  if (!id ||!book ) return;
  const currentUser = auth.currentUser?.email  || "guest@connectLibrary.ie";
  try {
    await updateDoc(doc(db, "books", id), {
        reservedBy: currentUser,
        reservationFee: RESERVATION_FEE,
    });
    setBook({ ...book, reservedBy: currentUser, reservationFee: RESERVATION_FEE });
      alert(
        "Book reserved for €" +
          RESERVATION_FEE.toFixed(5) +
          "! You will be next in line when it is returned."
      );
    } catch (error) {
      alert("Could not reserve book.");
      console.log(error);
    }
  }

return (
    <View style={styles.container}>
      <PageHeader title="Book Details" />
      <View style={styles.body}>
        {loading ? (
          <Text>Loading details...</Text>
        ) : !book ? (
          <Text>Book not found.</Text>
        ) : (
          <View style={styles.card}>
            <Text style={styles.title}>{book.title}</Text>
            <Text style={styles.author}>By {book.author}</Text>
            <Text style={styles.description}>
              {book.description || "A popular title available in the ConnectLibrary collection."}
            </Text>

            <Text style={[styles.status, { color: book.available ? "#2E7D32" : "#D32F2F" }]}>
              {book.available ? "Available to borrow" : "Currently on loan"}
            </Text>

           {book.available ? (
              <>
                <Text style={styles.label}>Choose how to receive this book:</Text>
                <View style={styles.row}>
                  <Pressable
                    style={[
                      styles.choiceBtn,
                      deliveryMethod === "Library Pickup" && styles.choiceSelected,
                    ]}
                    onPress={() => setDeliveryMethod("Library Pickup")}
                  >
                    <Text
                      style={[
                        styles.choiceText,
                        deliveryMethod === "Library Pickup" && styles.choiceTextSelected,
                      ]}
                    >
                      Library Pickup
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.choiceBtn,
                      deliveryMethod === "Home Delivery" && styles.choiceSelected,
                    ]}
                    onPress={() => setDeliveryMethod("Home Delivery")}
                  >
                    <Text
                      style={[
                        styles.choiceText,
                        deliveryMethod === "Home Delivery" && styles.choiceTextSelected,
                      ]}
                    >
                      Home Delivery
                    </Text>
                  </Pressable>
                </View>

                <Pressable style={styles.borrowButton} onPress={handleBorrow}>
                  <Text style={styles.borrowText}>Confirm Borrow (14-Day Loan)</Text>
                </Pressable>
              </>
            ) : (
             
              <View style={styles.reserveBox}>
                {book.dueDate ? (
                  <Text style={styles.dueNote}>Expected back by: {book.dueDate}</Text>
                ) : null}
                <Text style={styles.feeNote}>
                  Reservation Fee: €{RESERVATION_FEE.toFixed(5)} (paid on collection/delivery)
                </Text>
                {book.reservedBy ? (
                  <Text style={styles.reservedBadge}>
                    Reserved by: {book.reservedBy} (€{(book.reservationFee ?? RESERVATION_FEE).toFixed(2)})
                  </Text>
                ) : (
                  <Pressable style={styles.reserveButton} onPress={handleReserve}>
                    <Text style={styles.reserveText}>
                      Reserve This Book (€{RESERVATION_FEE.toFixed(5)})
                    </Text>
                  </Pressable>
                )}
              </View>
            )}

            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <Text style={styles.backText}>Back to Search</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F3ED" },
  body: { padding: 20 },
  card: { backgroundColor: "#FFFFFF", padding: 18, borderRadius: 10 },
  title: { fontSize: 24, fontWeight: "bold", color: "#2E2E2E" },
  author: { fontSize: 16, color: "#555555", marginTop: 4, marginBottom: 12 },
  description: { fontSize: 15, color: "#2E2E2E", lineHeight: 22, marginBottom: 14 },
  status: { fontSize: 16, fontWeight: "bold", marginBottom: 16 },
  label: { fontSize: 15, fontWeight: "bold", color: "#2E2E2E", marginBottom: 8 },
  row: { flexDirection: "row", gap: 10, marginBottom: 16 },
  choiceBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#B08463",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  choiceSelected: { backgroundColor: "#B08463" },
  choiceText: { color: "#B08463", fontWeight: "bold" },
  choiceTextSelected: { color: "#FFFFFF" },
  borrowButton: {
    backgroundColor: "#2E7D32",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  borrowText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
  reserveBox: { marginTop: 4, marginBottom: 8 },
  dueNote: { fontSize: 14, color: "#555555", marginBottom: 4 },
  feeNote: { fontSize: 14, color: "#2E2E2E", fontWeight: "bold", marginBottom: 10 },
  reserveButton: {
    backgroundColor: "#B08463",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  reserveText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
  reservedBadge: {
    backgroundColor: "#F7F3ED",
    color: "#B08463",
    fontWeight: "bold",
    padding: 12,
    borderRadius: 8,
    textAlign: "center",
  },
  backButton: { marginTop: 14, alignItems: "center", padding: 10 },
  backText: { color: "#B08463", fontWeight: "bold" },
});







    

    


    

