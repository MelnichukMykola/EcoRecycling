import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import styles from "../styles/Nav.module.scss";
import { LogOut } from "lucide-react";
import na from "../styles/NavAddons.module.scss";

export default function Nav() {
  const { user, signOutUser } = useAuth();
  const navigate = useNavigate();

  const displayName =
    (user?.displayName && user.displayName.trim()) ||
    (user?.email ? user.email.split("@")[0] : "");

  const initial = (displayName?.[0] || "U").toUpperCase();

  function handleAvatarClick() {
    navigate(user ? "/profil" : "/logowanie");
  }

  return (
    <header className={styles.headerArea} role="banner">
      <div className={styles.bar}>
        <Link
          to="/"
          className={styles.brand}
          aria-label="EkoRecykling – strona główna"
        >
          <img src="/cannabis.svg" alt="" className={styles.brandIcon} />
          <span className={styles.brandText}>EkoRecykling</span>
        </Link>
        <nav className={na.menu}>
          <a className={na.link} href="/#jak-to-dziala">
            Jak to działa?
          </a>
          <a className={na.link} href="/#ranking">
            Ranking
          </a>
          <Link className={na.link} to="/profil">
            Profil
          </Link>
          <Link className={na.link} to="/calculator">
            Kalkulator
          </Link>
        </nav>

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
      </div>
    </header>
  );
}
