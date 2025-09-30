import React from "react";
import s from "../styles/WhySort.module.scss";

export default function WhySort() {
  return (
    <section className={s.wrap} aria-labelledby="why-heading">
      <div className="container">
        <div className={s.card}>
          <h2 id="why-heading" className={s.title}>
            Dlaczego warto segregować odpady?
          </h2>

          <p className={s.lead}>
            Segregacja to prosty nawyk, który realnie zmniejsza ilość śmieci,
            redukuje emisje CO₂ i wspiera gospodarkę obiegu zamkniętego. Każdy
            poprawnie posegregowany kilogram to mniej odpadów na składowisku.
          </p>

          <div className={s.grid}>
            <article className={s.item}>
              <h3>👣 Mniej CO₂</h3>
              <p>
                Recykling surowców ogranicza zużycie energii i emisje gazów
                cieplarnianych.
              </p>
            </article>

            <article className={s.item}>
              <h3>🗑️ Mniej składowisk</h3>
              <p>Mniej odpadów trafia na wysypiska — więcej wraca do obiegu.</p>
            </article>

            <article className={s.item}>
              <h3>♻️ Obieg zamknięty</h3>
              <p>
                Plastik, szkło, papier i metal dostają drugie życie w nowych
                produktach.
              </p>
            </article>

            <article className={s.item}>
              <h3>💸 Oszczędności</h3>
              <p>
                Niższe koszty odbioru i nagrody w EcoCoins za odpowiedzialne
                działania.
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
