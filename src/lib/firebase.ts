// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDfRiDXeOg8BOg6CoW-1jv9hLZYbIr21ds",
  authDomain: "prghub-750a0.firebaseapp.com",
  databaseURL: "https://prghub-750a0.firebaseio.com",
  projectId: "prghub-750a0",
  storageBucket: "prghub-750a0.firebasestorage.app",
  messagingSenderId: "561559675161",
  appId: "1:561559675161:web:e395d30e207ce5f677a588",
  measurementId: "G-QSHLDXEGKT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
