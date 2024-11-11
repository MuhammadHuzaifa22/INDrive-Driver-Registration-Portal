
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAPwWD6oJoDm8QyYtS4BmsL0RfW5srJL6U",
  authDomain: "react-hook-form-f0a41.firebaseapp.com",
  projectId: "react-hook-form-f0a41",
  storageBucket: "react-hook-form-f0a41.appspot.com",
  messagingSenderId: "1093039396138",
  appId: "1:1093039396138:web:edcdb9c480d985221c7a53",
  measurementId: "G-WBJVH0M5HN"
};


export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
