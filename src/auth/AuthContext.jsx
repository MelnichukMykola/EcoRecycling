import React, { createContext, useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../../firebase.js";
import {
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updatePassword,
  updateProfile,
  reload,
} from "firebase/auth";
import Loader from "../components/Loader.jsx";

const Ctx = createContext(null);
export function useAuth() {
  return useContext(Ctx);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  async function registerUser(email, password, displayName) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }
    await reload(cred.user);
    setUser(auth.currentUser);
    return cred.user;
  }

  async function signIn(email, password) {
    return await signInWithEmailAndPassword(auth, email, password);
  }
  async function resetPassword(email) {
    return await sendPasswordResetEmail(auth, email);
  }
  async function changePassword(newPassword) {
    await updatePassword(auth.currentUser, newPassword);
    await reload(auth.currentUser);
    setUser(auth.currentUser);
  }
  async function updateDisplayName(displayName) {
    await updateProfile(auth.currentUser, { displayName });
    await reload(auth.currentUser);
    setUser(auth.currentUser);
  }
  async function signOutUser() {
    await signOut(auth);
  }

  const value = {
    user,
    registerUser,
    signIn,
    resetPassword,
    changePassword,
    updateDisplayName,
    signOutUser,
  };
  if (loading) return <Loader fullscreen label="Ładowanie..." />;
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function PrivateRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/logowanie" replace />;
  return children;
}
