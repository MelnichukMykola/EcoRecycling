import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import s from "../styles/Hero.module.scss";

export default function Hero() {
  const { user } = useAuth();

  return (
    <section className={`${s.heroWrap} ${s.blobss}`} aria-label="Intro">
      <div className="container">
        <div className={s.card}>
          <h1 className={s.title}>Zarabiaj za recykling odpadów</h1>

          <p className={s.subtitle}>
            Oddawaj plastik, papier, szkło czy elektroodpady i zdobywaj{" "}
            <strong>EcoCoins</strong>. Wymień je na nagrody lub wypłać środki.
            Bezpieczne logowanie (2FA), profil użytkownika i pełna historia
            transakcji.
          </p>

          {!user && (
            <div className={s.ctaRow}>
              <Link className="btnPrimary" to="/rejestracja">
                Załóż konto
              </Link>
              <Link className="btnGhost" to="/logowanie">
                Zaloguj się
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
