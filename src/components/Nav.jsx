// src/components/Nav.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { LogOut } from "lucide-react";
import styles from "../styles/Nav.module.scss";

export default function Nav() {
  const { user, signOutUser } = useAuth();
  const navigate = useNavigate();

  const displayName =
    (user?.displayName && user.displayName.trim()) ||
    (user?.email ? user.email.split("@")[0] : "");

  const initial = (displayName?.[0] || "U").toUpperCase();

  const logoUrl = `${import.meta.env.BASE_URL}cannabis.svg`;

  function handleAvatarClick() {
    navigate(user ? "/profil" : "/logowanie");
  }

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.brand}>
        <img
          src={logoUrl}
          alt=""
          width="22"
          height="22"
          className={styles.logoIcon}
        />
        EkoRecykling
      </Link>

      <div className={styles.actions}>
        {user && <span className={styles.userName}>{displayName}</span>}
        {user && (
          <button
            type="button"
            onClick={signOutUser}
            className={styles.iconBtn}
            aria-label="Wyloguj"
            title="Wyloguj"
          >
            <LogOut className={styles.icon} />
          </button>
        )}
        <button
          type="button"
          className={styles.avatarBtn}
          onClick={handleAvatarClick}
          aria-label={user ? "Otwórz profil" : "Przejdź do logowania"}
          title={user ? "Profil" : "Logowanie"}
        >
          {user?.photoURL ? (
            <img src={user.photoURL} alt="" className={styles.avatarImg} />
          ) : (
            <span className={styles.avatarFallback}>{initial}</span>
          )}
        </button>
      </div>
    </header>
  );
}
