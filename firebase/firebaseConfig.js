/* eslint-disable prettier/prettier */
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCqyERoLY1460iPnI-ucFMQOBEoiYlVX_o",
  authDomain: "thefitnessdiaries-e1db5.firebaseapp.com",
  projectId: "thefitnessdiaries-e1db5",
  storageBucket: "thefitnessdiaries-e1db5.firebasestorage.app",
  messagingSenderId: "541729892691",
  appId: "1:541729892691:web:0ec585e3c99286049ad9a6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firestore and Auth instances
export const db = getFirestore(app);
export const auth = getAuth(app);
