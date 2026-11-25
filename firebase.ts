import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBpxiSTU8Onm7kUqZDeQS3-qk5N_rMDJiY",
  authDomain: "myconnectlibraryapp.firebaseapp.com",
  projectId: "myconnectlibraryapp",
  storageBucket: "myconnectlibraryapp.firebasestorage.app",
  messagingSenderId: "308063903072",
  appId: "1:308063903072:web:d0a6f942c387c7b95e1205"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);


