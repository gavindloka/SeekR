// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC1pDpbffq_2cFQYDhb4g1ddvq6M_XczWE",
  authDomain: "seekr-c59ed.firebaseapp.com",
  projectId: "seekr-c59ed",
  storageBucket: "seekr-c59ed.firebasestorage.app",
  messagingSenderId: "408852672091",
  appId: "1:408852672091:web:41bd7ccfcb56dc8593197e",
  measurementId: "G-CM07TCJ10S",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore(app)
export default app;