import React from "react";
import s from "../styles/ResetFaq.module.scss";

export default function ResetFaq() {
  return (
    <section className={s.wrap} aria-labelledby="faq-title">
      <div className="container">
        <h3 id="faq-title" className={s.title}>
          Najczęstsze pytania
        </h3>

        <div className={s.list}>
          <details className={s.item}>
            <summary>Nie pamiętam, czy mam konto na ten e-mail.</summary>
            <div className={s.body}>
              Ze względów bezpieczeństwa nie potwierdzamy istnienia konta. Jeśli
              konto istnieje – wyślemy link resetu na podany adres.
            </div>
          </details>

          <details className={s.item}>
            <summary>Wysłałem link, ale nic nie przyszło.</summary>
            <div className={s.body}>
              Sprawdź folder Spam i zakładki typu Oferty. Upewnij się, że
              wpisany adres jest poprawny, a następnie wyślij link ponownie.
            </div>
          </details>

          <details className={s.item}>
            <summary>Link wygasł – co dalej?</summary>
            <div className={s.body}>
              Po prostu ponów wysyłkę linku na tej stronie. Nowy link będzie
              ważny przez ograniczony czas.
            </div>
          </details>
        </div>
      </div>
    </section>
  );
}
