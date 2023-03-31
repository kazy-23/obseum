import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCBQx5R-VyX3SMRDcxo5JiVzgtcsqJNjbQ",
  authDomain: "obseum-86a2e.firebaseapp.com",
  projectId: "obseum-86a2e",
  storageBucket: "obseum-86a2e.appspot.com",
  messagingSenderId: "64315896478",
  appId: "1:64315896478:web:7c77f544c5971c2ca5418f",
  measurementId: "G-9FZT8QLGHD"
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const auth = getAuth();