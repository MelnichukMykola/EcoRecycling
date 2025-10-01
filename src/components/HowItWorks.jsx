// components/HowItWorks.jsx
import React from "react";
import s from "../styles/HowItWorks.module.scss";

export default function HowItWorks() {
  return (
    <section
      id="jak-to-dziala"
      className={`${s.howWrap} ${s.forestPanel}`}
      aria-label="Jak to działa?"
    >
      <div className="container">
        <div className={s.glass}>
          <h2 className={s.h2}>
            <span className={s.hIcon} aria-hidden />
            Jak to działa?
          </h2>

          <ol className={s.steps}>
            <li className={s.step}>
              <span className={s.badge}>1</span>
              <p>Zarejestruj się i uzupełnij profil.</p>
            </li>
            <li className={s.step}>
              <span className={s.badge}>2</span>
              <p>Dodaj zgłoszenie odbioru lub wybierz punkt zbiórki.</p>
            </li>
            <li className={s.step}>
              <span className={s.badge}>3</span>
              <p>Oddaj odpady i potwierdź wagę (QR / wpis).</p>
            </li>
            <li className={s.step}>
              <span className={s.badge}>4</span>
              <p>Otrzymaj EcoCoins — wymień na zniżki lub wypłać.</p>
            </li>
          </ol>

          <div className={s.featureGrid}>
            <article className={`${s.featureCard} ${s.fc1}`}>
              <span className={s.ic + " " + s.icCoin} aria-hidden />
              <h3>Przejrzyste nagrody</h3>
              <p>
                Jasny przelicznik za kilogramy i rodzaje surowców. Zero ukrytych
                kosztów.
              </p>
            </article>
            <article className={`${s.featureCard} ${s.fc2}`}>
              <span className={s.ic + " " + s.icMap} aria-hidden />
              <h3>Mapa punktów</h3>
              <p>
                Znajdź najbliższy punkt zbiórki lub zamów odbiór prosto spod
                domu.
              </p>
            </article>
            <article className={`${s.featureCard} ${s.fc3}`}>
              <span className={s.ic + " " + s.icShield} aria-hidden />
              <h3>Bezpieczeństwo</h3>
              <p>
                Logowanie z 2FA (TOTP), reset i zmiana hasła, kontrola danych w
                profilu.
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
