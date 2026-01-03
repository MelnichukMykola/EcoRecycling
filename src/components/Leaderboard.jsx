import React from "react";
import s from "../styles/Leaderboard.module.scss";

const DATA = [
  { name: "Jan Kowalski", city: "Warszawa", kg: 482.6, last: "wczoraj" },
  { name: "Anna Nowak", city: "Kraków", kg: 451.2, last: "2 dni temu" },
  { name: "Piotr Zieliński", city: "Gdańsk", kg: 433.8, last: "5 dni temu" },
  {
    name: "Zofia Wiśniewska",
    city: "Wrocław",
    kg: 398.4,
    last: "1 tydzień temu",
  },
  { name: "Michał Wójcik", city: "Poznań", kg: 372.9, last: "3 dni temu" },
  { name: "Katarzyna Mazur", city: "Łódź", kg: 361.7, last: "wczoraj" },
  { name: "Tomasz Kamiński", city: "Szczecin", kg: 344.1, last: "6 dni temu" },
  {
    name: "Agnieszka Dąbrowska",
    city: "Białystok",
    kg: 332.5,
    last: "4 dni temu",
  },
  {
    name: "Magdalena Lewandowska",
    city: "Lublin",
    kg: 321.4,
    last: "2 tyg. temu",
  },
  {
    name: "Krzysztof Nowicki",
    city: "Katowice",
    kg: 309.8,
    last: "7 dni temu",
  },
];

export default function Leaderboard() {
  const top = DATA[0]?.kg ?? 1;
  const ecoPerKg = 8;

  return (
    <section
      id="ranking"
      className={`${s.lbWrap} ${s.forestPanel}`}
      aria-label="Ranking recyklerów"
    >
      <div className="container">
        <div className={s.glass}>
          <header className={s.head}>
            <h2 className={s.title}>Ranking recyklerów</h2>
            <p className={s.note}>
              Top 10 użytkowników z największą ilością przetworzonych odpadów.
            </p>
          </header>

          <div
            className={s.tableWrap}
            role="region"
            aria-label="Tabela wyników"
          >
            <table className={s.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Uczestnik</th>
                  <th>Miasto</th>
                  <th>Razem (kg)</th>
                  <th>EcoCoins</th>
                  <th>Ostatnio</th>
                </tr>
              </thead>
              <tbody>
                {DATA.map((row, idx) => {
                  const eco = Math.round(row.kg * ecoPerKg);
                  const pct = Math.min(100, Math.round((row.kg / top) * 100));
                  return (
                    <tr key={row.name}>
                      <td className={s.rank}>
                        <span
                          className={`${s.medal} ${
                            idx === 0
                              ? s.gold
                              : idx === 1
                              ? s.silver
                              : idx === 2
                              ? s.bronze
                              : ""
                          }`}
                        >
                          {idx + 1}
                        </span>
                      </td>
                      <td className={s.person}>
                        <span className={s.avatar} aria-hidden>
                          {row.name
                            .split(" ")
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("")}
                        </span>
                        <span className={s.name}>{row.name}</span>
                      </td>
                      <td className={s.city}>{row.city}</td>
                      <td className={s.kg}>
                        <div
                          className={s.bar}
                          aria-hidden
                          style={{ "--pct": `${pct}%` }}
                        />
                        <span>{row.kg.toFixed(1)}</span>
                      </td>
                      <td className={s.eco}>{eco.toLocaleString("pl-PL")}</td>
                      <td className={s.last}>{row.last}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
