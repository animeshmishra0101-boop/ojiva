import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDGBoTnzVPTTQUdaaUbcv4UIa_VD3wuP6Q",
  authDomain: "ojaaa-367b0.firebaseapp.com",
  projectId: "ojaaa-367b0",
  storageBucket: "ojaaa-367b0.firebasestorage.app",
  messagingSenderId: "61093923153",
  appId: "1:61093923153:web:b68eeea54022b18d93eb70",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
