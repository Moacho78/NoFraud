// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    updateProfile } from "firebase/auth";

import { getFirestore, API_KEY } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBHLt2BwzJ9_6REugWvRnIKdET4dK5HlYk",
  authDomain: "nofraud-74418.firebaseapp.com",
  projectId: "nofraud-74418",
  storageBucket: "nofraud-74418.firebasestorage.app",
  messagingSenderId: "39079351142",
  appId: "1:39079351142:web:8935c51a6670cc9fd76ea7",
  measurementId: "G-EQDNNE2TJX"
};

// Inicializa Firebase (evita inicializar más de una vez)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Inicializa servicios
const auth = getAuth(app);
const db = getFirestore(app);

// Exporta todos los servicios y funciones necesarias
export {
    auth,
    db,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    updateProfile
};