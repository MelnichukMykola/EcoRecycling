import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext.jsx";
import { Link } from "react-router-dom";
import { useCoins } from "../coins/useCoins.js";
import { useNotify } from "../ui/useNotify.js";
import { authErrorPL } from "../utils/authErrorsPL.js";
import s from "../styles/Profil.module.scss";

import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  getMultiFactorResolver,
  TotpMultiFactorGenerator,
} from "firebase/auth";
import { auth } from "../../firebase.js";
import SupportForm from "../components/SupportForm.jsx";

export default function Profil() {
  const { user, updateDisplayName, changePassword } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [tab, setTab] = useState("overview");
  const notify = useNotify();

  const { balance } = useCoins(user?.uid);

  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showReauth, setShowReauth] = useState(false);
  const [currentPass, setCurrentPass] = useState("");
  const [totp, setTotp] = useState("");
  const [resolver, setResolver] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!user) return <p>Brak danych użytkownika.</p>;

  async function saveProfile(e) {
    e.preventDefault();
    try {
      await updateDisplayName(displayName.trim());
      notify.success("Zapisano nazwę profilu.");
    } catch (err) {
      notify.error(authErrorPL(err?.code));
    }
  }

  async function doUpdatePassword(finalPassword) {
    await changePassword(finalPassword);
  }

  async function startChangePassword(e) {
    e.preventDefault();
    if (newPass.length < 6) {
      notify.error("Hasło musi mieć co najmniej 6 znaków.");
      return;
    }
    if (newPass !== confirmPass) {
      notify.error("Hasła nie są takie same.");
      return;
    }
    setLoading(true);
    try {
      await doUpdatePassword(newPass);
      setNewPass("");
      setConfirmPass("");
      notify.success("Hasło zmienione.");
    } catch (err) {
      if (
        err?.code === "auth/requires-recent-login" ||
        err?.code === "auth/multi-factor-auth-required"
      ) {
        if (err?.code === "auth/multi-factor-auth-required") {
          const r = getMultiFactorResolver(auth, err);
          setResolver(r);
        }
        setShowReauth(true);
        notify.info("Potwierdź tożsamość, aby zmienić hasło.");
      } else {
        notify.error(authErrorPL(err?.code));
      }
    } finally {
      setLoading(false);
    }
  }

  async function confirmReauth(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const cred = EmailAuthProvider.credential(user.email, currentPass);
      try {
        await reauthenticateWithCredential(auth.currentUser, cred);
      } catch (err) {
        if (err?.code === "auth/multi-factor-auth-required") {
          const r = getMultiFactorResolver(auth, err);
          setResolver(r);
        } else {
          throw err;
        }
      }

      if (resolver) {
        const totpHint =
          resolver.hints.find((h) => h.factorId === "totp") ||
          resolver.hints[0];
        const assertion = TotpMultiFactorGenerator.assertionForSignIn(
          totpHint.uid,
          totp
        );
        await resolver.resolveSignIn(assertion);
      }

      await doUpdatePassword(newPass);
      setShowReauth(false);
      setCurrentPass("");
      setTotp("");
      setNewPass("");
      setConfirmPass("");
      notify.success("Hasło zmienione.");
    } catch (err) {
      notify.error(authErrorPL(err?.code));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className={s.container}>
      <header className={s.head}>
        <h2 className={s.title}>Twój profil</h2>

        <div className={s.tabs}>
          <button
            className={`${s.tab} ${tab === "overview" ? s.tabActive : ""}`}
            onClick={() => setTab("overview")}
          >
            Przegląd
          </button>
          <button
            className={`${s.tab} ${tab === "profile" ? s.tabActive : ""}`}
            onClick={() => setTab("profile")}
          >
            Ustawienia profilu
          </button>
          <button
            className={`${s.tab} ${tab === "password" ? s.tabActive : ""}`}
            onClick={() => setTab("password")}
          >
            Zmiana hasła
          </button>
          <button
            className={`${s.tab} ${tab === "support" ? s.tabActive : ""}`}
            onClick={() => setTab("support")}
          >
            Wsparcie
          </button>
        </div>
      </header>

      {tab === "overview" && (
        <div className={s.panel}>
          <p className={s.signedAs}>
            Zalogowano jako: <strong>{user.email}</strong>
          </p>

          <div className={s.balanceCard}>
            <div className={s.balanceLabel}>Twój balans</div>
            <div className={s.balanceRow}>
              <div className={s.balanceValue}>{balance}</div>
              <span className={s.balanceUnit}>EcoCoins</span>
            </div>
          </div>
        </div>
      )}

      {tab === "profile" && (
        <div className={s.panel}>
          <form onSubmit={saveProfile} className={s.form}>
            <label className={s.label}>
              Nazwa wyświetlana
              <input
                className={s.input}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </label>
            <button className={s.button} type="submit">
              Zapisz profil
            </button>
          </form>
        </div>
      )}

      {tab === "password" && (
        <div className={s.panel}>
          {!showReauth ? (
            <form onSubmit={startChangePassword} className={s.form}>
              <label className={s.label}>
                Nowe hasło
                <input
                  className={s.input}
                  type="password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="min 6 znaków"
                />
              </label>
              <label className={s.label}>
                Powtórz hasło
                <input
                  className={s.input}
                  type="password"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                />
              </label>
              <button className={s.button} type="submit" disabled={loading}>
                {loading ? "Zapisywanie..." : "Zmień hasło"}
              </button>
            </form>
          ) : (
            <form onSubmit={confirmReauth} className={s.form}>
              <p className={s.note}>
                Ze względów bezpieczeństwa potwierdź tożsamość.
              </p>
              <label className={s.label}>
                Aktualne hasło
                <input
                  className={s.input}
                  type="password"
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                />
              </label>

              <button className={s.button} type="submit" disabled={loading}>
                {loading ? "Potwierdzanie..." : "Potwierdź i zmień hasło"}
              </button>
            </form>
          )}
        </div>
      )}

      {tab === "support" && <SupportForm user={user} />}
    </section>
  );
}
