
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCKeyIq5RnsP4JM5STbHIdeJHpCOHhlSdM",
  authDomain: "propsmartfinds.firebaseapp.com",
  projectId: "propsmartfinds",
  storageBucket: "propsmartfinds.appspot.com", 
  messagingSenderId: "647969246238",
  appId: "1:647969246238:web:ca6c9531119f777332320f",
  measurementId: "G-4SX5HTM6BM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
