import React from "react";
import { Mail, ShieldCheck, LifeBuoy } from "lucide-react";
import s from "../styles/ResetHelp.module.scss";

export default function ResetHelp() {
  return (
    <section className={s.wrap} aria-labelledby="help-title">
      <div className="container">
        <h3 id="help-title" className={s.title}>
          Nie dostałeś e-maila?
        </h3>

        <div className={s.grid}>
          <article className={s.card}>
            <div className={s.icon}>
              <Mail />
            </div>
            <h4>Sprawdź folder Spam</h4>
            <p>
              E-mail z linkiem mógł trafić do spamu lub zakładki „Oferty”. W
              razie potrzeby spróbuj wysłać link ponownie.
            </p>
          </article>

          <article className={s.card}>
            <div className={s.icon}>
              <ShieldCheck />
            </div>
            <h4>Link wygasa po czasie</h4>
            <p>
              Link resetu jest ważny przez ograniczony czas. Jeśli wygasł –
              wyślij nowy z tego samego adresu e-mail.
            </p>
          </article>

          <article className={s.card}>
            <div className={s.icon}>
              <LifeBuoy />
            </div>
            <h4>Wciąż problem?</h4>
            <p>
              Napisz do nas:{" "}
              <a href="mailto:support@ekorecykling.app">
                support@ekorecykling.app
              </a>
              . Chętnie pomożemy.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
