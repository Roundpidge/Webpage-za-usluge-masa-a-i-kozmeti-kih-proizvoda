// src/firebase.js
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env?.VITE_FIREBASE_API_KEY ?? "AIzaSyCtALAKzNM3fN0sCPHJeKYDeDYmuWswN6g",
  authDomain: import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN ?? "fir-project-sz.firebaseapp.com",
  projectId: import.meta.env?.VITE_FIREBASE_PROJECT_ID ?? "fir-project-sz",
  storageBucket: import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET ?? "fir-project-sz.appspot.com",
  messagingSenderId: import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "404970980774",
  appId: import.meta.env?.VITE_FIREBASE_APP_ID ?? "1:404970980774:web:611af013bb34728e517b67",
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()
