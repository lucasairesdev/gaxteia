import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBlGp5JNIOuK5Wo2ydfbMBz9GeVfv3dl3k",
  authDomain: "gaxteia.firebaseapp.com",
  projectId: "gaxteia",
  storageBucket: "gaxteia.firebasestorage.app",
  messagingSenderId: "476037744253",
  appId: "1:476037744253:web:baa8941205a1b09eee1314",
  measurementId: "G-3CC917TPZ3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db, analytics }; 