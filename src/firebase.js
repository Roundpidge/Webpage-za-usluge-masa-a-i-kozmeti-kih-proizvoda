// Učitavanje potrebnih funkcija
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Firebase konfiguracija

const firebaseConfig = {
    apiKey: "AIzaSyCtALAKzNM3fN0sCPHJeKYDeDYmuWswN6g",
    authDomain: "fir-project-sz.firebaseapp.com",
    projectId: "fir-project-sz",
    storageBucket: "fir-project-sz.firebasestorage.com",
    messagingSenderId: "404970980774",
    appId: "1:404970980774:web:611af013bb34728e517b67"
};
// Firebase inicijalizacija
const app = initializeApp(firebaseConfig);
// Inicijalizacija servisa
const auth = getAuth(app); // auth instanca
const db = getFirestore(app); // database instanca
// Izvoz servisa
export { auth, db };