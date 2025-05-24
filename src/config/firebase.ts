import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBlGp5JNIOuK5Wo2ydfbMBz9GeVfv3dl3k",
  authDomain: "gaxteia.firebaseapp.com",
  projectId: "gaxteia",
  storageBucket: "gaxteia.appspot.com",
  messagingSenderId: "476037744253",
  appId: "1:476037744253:web:baa8941205a1b09eee1314",
  measurementId: "G-3CC917TPZ3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);

// Habilitar persistência offline
enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Múltiplas abas abertas, persistência offline não pode ser habilitada');
    } else if (err.code === 'unimplemented') {
      console.warn('O navegador não suporta persistência offline');
    }
  }); 