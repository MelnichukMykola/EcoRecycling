import React from "react";
import { Link } from "react-router-dom";
import s from "../styles/Home.module.scss";

export default function Home() {
    return (
        <section className={s.container}>
            <div className={s.hero}>
                <h1 className={s.title}>Zarabiaj za recykling odpadów</h1>
                <p className={s.subtitle}>
                    Oddawaj plastik, papier, szkło czy elektroodpady i zdobywaj <strong>EcoCoins</strong>. Wymień je na nagrody lub wypłać
                    środki*. Bezpieczne logowanie (2FA), profil użytkownika i pełna historia transakcji.
                </p>
                <div className={s.ctaRow}>
                    <Link className={s.btnPrimary} to="/rejestracja">
                        Załóż konto
                    </Link>
                    <Link className={s.btnGhost} to="/logowanie">
                        Zaloguj się
                    </Link>
                </div>
                <p className={s.note}>* model wypłat/nagród w fazie projektu — demo funkcjonalne.</p>
            </div>

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
                        <p>Jasny przelicznik za kilogramy i rodzaje surowców. Zero ukrytych kosztów.</p>
                    </article>
                    <article className={s.card}>
                        <h3>Mapa punktów</h3>
                        <p>Znajdź najbliższy punkt zbiórki lub zamów odbiór prosto spod domu.</p>
                    </article>
                    <article className={s.card}>
                        <h3>Bezpieczeństwo</h3>
                        <p>Logowanie z 2FA (TOTP), reset i zmiana hasła, kontrola danych w profilu.</p>
                    </article>
                </div>
            </section>
        </section>
    );
}
