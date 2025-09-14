import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDU1uWKuVlxxAC726npn6SK9azqiaOatLI",
  authDomain: "ecoapp-auth.firebaseapp.com",
  projectId: "ecoapp-auth",
  storageBucket: "ecoapp-auth.firebasestorage.app",
  messagingSenderId: "322024994814",
  appId: "1:322024994814:web:35ff182b3b5cb2c233b2af",
  measurementId: "G-H3TY0XQ1FV",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

if (typeof window !== "undefined") window.firebaseAuth = auth;

export default app;
