import React from "react";
import s from "../styles/Home.module.scss";
import Hero from "../components/Hero.jsx";
import WhySort from "../components/WhySort.jsx";

export default function Home() {
  return (
    <>
      <Hero />
      <WhySort />
      <section className={s.container}>
        <section className={s.how}>
          <h2>Jak to działa?</h2>
          <ol className={s.steps}>
            <li>
              <span>1</span> Zarejestruj się i uzupełnij profil.
            </li>
            <li>
              <span>2</span> Dodaj zgłoszenie odbioru lub wybierz punkt zbiórki.
            </li>
            <li>
              <span>3</span> Oddaj odpady i potwierdź wagę (QR / wpis).
            </li>
            <li>
              <span>4</span> Otrzymaj EcoCoins — wymień na zniżki lub wypłać.
            </li>
          </ol>
        </section>

        <section className={s.features}>
          <div className={s.grid}>
            <article className={s.card}>
              <h3>Przejrzyste nagrody</h3>
              <p>
                Jasny przelicznik za kilogramy i rodzaje surowców. Zero ukrytych
                kosztów.
              </p>
            </article>
            <article className={s.card}>
              <h3>Mapa punktów</h3>
              <p>
                Znajdź najbliższy punkt zbiórki lub zamów odbiór prosto spod
                domu.
              </p>
            </article>
            <article className={s.card}>
              <h3>Bezpieczeństwo</h3>
              <p>
                Logowanie z 2FA (TOTP), reset i zmiana hasła, kontrola danych w
                profilu.
              </p>
            </article>
          </div>
        </section>
      </section>
    </>
  );
}
