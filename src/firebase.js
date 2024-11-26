import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyByIwB-l2JXXee4tv-039o-hJXzcdwKByM",
  authDomain: "notekeeper-application-20a9a.firebaseapp.com",
  projectId: "notekeeper-application-20a9a",
  storageBucket: "notekeeper-application-20a9a.firebasestorage.app",
  messagingSenderId: "964904522355",
  appId: "1:964904522355:web:89b78331d2a99edd5dd006",
  measurementId: "G-S36PX0TVP5"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app); 

const analytics = getAnalytics(app);
