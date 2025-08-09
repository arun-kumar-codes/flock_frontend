import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyAmK6QfjPgLppLORW0LKvkX0Zgj7zblNVw",
  authDomain: "flock-1e6cb.firebaseapp.com",
  projectId: "flock-1e6cb",
  storageBucket: "flock-1e6cb.firebasestorage.app",
  messagingSenderId: "151914423932",
  appId: "1:151914423932:web:55451ce6bf2ad8098c4bf9",
  measurementId: "G-75VPLG14EY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);