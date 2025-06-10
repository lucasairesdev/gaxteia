import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBDqH4OcOskGXsuAfPehaZ83UUpRojIFaE",
  authDomain: "gaxteia-97277.firebaseapp.com",
  projectId: "gaxteia-97277",
  storageBucket: "gaxteia-97277.firebasestorage.app",
  messagingSenderId: "655253729229",
  appId: "1:655253729229:web:c813311d2509aee5b7de84",
  measurementId: "G-4DZLW1WCR5"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app); 