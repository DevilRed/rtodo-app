import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: "react-todo-app-eb9cf.firebaseapp.com",
  projectId: "react-todo-app-eb9cf",
  storageBucket: "react-todo-app-eb9cf.firebasestorage.app",
  messagingSenderId: "992496408472",
  appId: "1:992496408472:web:f7ea44521d69cab217bded",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
