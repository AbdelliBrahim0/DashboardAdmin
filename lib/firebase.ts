import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCvRdHKNQ_HIa7m0C4uw1UQI6nXN3NLOvQ",
  authDomain: "be9ik-wallet.firebaseapp.com",
  databaseURL: "https://be9ik-wallet-default-rtdb.firebaseio.com",
  projectId: "be9ik-wallet",
  storageBucket: "be9ik-wallet.firebasestorage.app",
  messagingSenderId: "63718672112",
  appId: "1:63718672112:web:3cf2aeb9e70951353de435"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
