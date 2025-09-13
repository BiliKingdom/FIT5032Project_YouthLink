// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCbngIm8zMmujKiQaHbejMqyThg7My2U6w",
  authDomain: "youthlink-1b9e0.firebaseapp.com",
  projectId: "youthlink-1b9e0",
  storageBucket: "youthlink-1b9e0.firebasestorage.app",
  messagingSenderId: "977707191857",
  appId: "1:977707191857:web:bced8eedaec3d8ea480f10"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

export default app;