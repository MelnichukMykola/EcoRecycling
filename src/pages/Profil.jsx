import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext.jsx";
import { Link } from "react-router-dom";
import { useCoins } from "../coins/useCoins.js";
import { useNotify } from "../ui/useNotify.js";
import { authErrorPL } from "../utils/authErrorsPL.js";
import s from "../styles/Profil.module.scss";

export default function Profil() {
  const { user, updateDisplayName, changePassword } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [newPassword, setNewPassword] = useState("");
  const [tab, setTab] = useState("overview");
  const notify = useNotify();

  const { balance } = useCoins(user?.uid);

  if (!user) return <p>Brak danych użytkownika.</p>;

  async function saveProfile(e) {
    e.preventDefault();
    try {
      await updateDisplayName(displayName.trim());
      notify.success("Zapisano nazwę profilu.");
    } catch (err) {
      const nice = authErrorPL(err?.code);
      notify.error(nice);
    }
  }

  async function change(e) {
    e.preventDefault();
    try {
      await changePassword(newPassword);
      setNewPassword("");
      notify.success("Hasło zmienione.");
    } catch (err) {
      const nice = authErrorPL(err?.code);
      notify.error(nice);
    }
  }

  return (
    <section className={s.container}>
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
      </div>

      {tab === "overview" && (
        <div className={s.panel}>
          <p>
            Zalogowano jako: <strong>{user.email}</strong>
          </p>

          <div className={s.balanceCard}>
            <div className={s.balanceLabel}>Twój balans</div>
            <div className={s.balanceRow}>
              <div className={s.balanceValue}>{balance}</div>
              <span className={s.balanceUnit}>EcoCoins</span>
            </div>
          </div>

          <div className={s.link} style={{ marginTop: 12 }}>
            <Link to="/2fa">Skonfiguruj 2FA (TOTP)</Link>
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
          <form onSubmit={change} className={s.form}>
            <label className={s.label}>
              Nowe hasło
              <input
                className={s.input}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                type="password"
                placeholder="min 6 znaków"
              />
            </label>
            <button className={s.button} type="submit">
              Zmień hasło
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
