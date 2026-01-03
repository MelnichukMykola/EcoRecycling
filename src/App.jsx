import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Nav from "./components/Nav.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ResetHasla from "./pages/ResetHasla.jsx";
import Profil from "./pages/Profil.jsx";
import TwoFA from "./pages/TwoFA.jsx";
import { AuthProvider, PrivateRoute } from "./auth/AuthContext.jsx";
import layout from "./styles/Layout.module.scss";
import CalculatorPage from "./pages/CalculatorPage.jsx";
import RankingPage from "./pages/RankingPage.jsx";
import HowItWorks from "./components/HowItWorks.jsx";

export default function App() {
  return (
    <AuthProvider>
      <div className={layout.wrapper}>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/logowanie" element={<Login />} />
          <Route path="/rejestracja" element={<Register />} />
          <Route path="/reset-hasla" element={<ResetHasla />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/ranking" element={<RankingPage />} />
          <Route path="/jak-to-dziala" element={<HowItWorks />} />
          <Route
            path="/profil"
            element={
              <PrivateRoute>
                <Profil />
              </PrivateRoute>
            }
          />
          <Route
            path="/2fa"
            element={
              <PrivateRoute>
                <TwoFA />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}
