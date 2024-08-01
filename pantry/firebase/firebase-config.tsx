// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAQBhpbvzFW8Bbd3N9kZ6QVqoLyL6-d6iw",
  authDomain: "pantry-tracker-cc8d6.firebaseapp.com",
  projectId: "pantry-tracker-cc8d6",
  storageBucket: "pantry-tracker-cc8d6.appspot.com",
  messagingSenderId: "859267549433",
  appId: "1:859267549433:web:2b72d03ed761d350d37a28",
  measurementId: "G-HZDY67T4K8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);