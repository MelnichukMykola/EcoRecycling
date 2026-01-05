import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext.jsx";
import { useNotify } from "../ui/useNotify.js";
import s from "../styles/Leaderboard.module.scss";

const BOTS = [
  { name: "Maks Fedytsiv", city: "Kraków", eco: 3860, last: "wczoraj" },
  { name: "Denis Martseniuk", city: "Warszawa", eco: 3610, last: "2 dni temu" },
  { name: "Wojciech Kwietnieski", city: "Gdańsk", eco: 3470, last: "5 dni temu" },
  { name: "Kacper Rogosz", city: "Wrocław", eco: 3187, last: "1 tydzień temu" },
  { name: "Dmytro Maksymenko", city: "Poznań", eco: 2983, last: "3 dni temu" },
  { name: "Kacper Augustyn", city: "Łódź", eco: 2893, last: "wczoraj" },
  { name: "Tomasz Paż", city: "Szczecin", eco: 2752, last: "6 dni temu" },
  { name: "Marzec Dominik", city: "Białystok", eco: 2660, last: "4 dni temu" },
  { name: "Kszystof Wiśniowski", city: "Lublin", eco: 2571, last: "2 tyg. temu" },
];

export default function Leaderboard() {
  const { user } = useAuth();
  const notify = useNotify();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isPayoutAnimating, setIsPayoutAnimating] = useState(false);

  useEffect(() => {
    const userEco = user ? Number(localStorage.getItem(`total_eco_${user.uid}`)) || 0 : 0;
    
    const currentUser = {
      name: user?.displayName || user?.email?.split("@")[0] || "Ty",
      city: "Twoje Miasto",
      eco: isPayoutAnimating ? 0 : userEco,
      last: "teraz",
      isCurrentUser: true,
    };

    const combined = [...BOTS, currentUser];
    const sorted = combined.sort((a, b) => b.eco - a.eco);
    setLeaderboardData(sorted.slice(0, 10));
  }, [user, isPayoutAnimating]);

  const handlePayout = () => {
    const userEco = Number(localStorage.getItem(`total_eco_${user.uid}`)) || 0;
    if (userEco <= 0) return notify.info("Brak monet do wypłaty!");

    if (window.confirm(`Wypłacić ${userEco} EcoCoins?`)) {
      setIsPayoutAnimating(true);
      setTimeout(() => {
        localStorage.setItem(`total_eco_${user.uid}`, 0);
        setIsPayoutAnimating(false);
        notify.success("Monety zostały wypłacone!");
      }, 1000);
    }
  };

  const topScore = leaderboardData[0]?.eco ?? 1;

  return (
    <section id="ranking" className={`${s.lbWrap} ${s.forestPanel}`}>
      <div className="container">
        <div className={s.glass}>
          <header className={s.head}>
            <div className={s.headFlex}>
              <div>
                <h2 className={s.title}>Ranking Eko-Liderów</h2>
                <p className={s.note}>Najlepsi uczestnicy posortowani według EcoCoins.</p>
              </div>
              {user && (
                <button className={s.payoutBtn} onClick={handlePayout} disabled={isPayoutAnimating}>
                  {isPayoutAnimating ? "Przetwarzanie..." : "Wypłać monety"}
                </button>
              )}
            </div>
          </header>

          <div className={s.tableWrap}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Uczestnik</th>
                  <th>EcoCoins</th>
                  <th>Postęp</th>
                  <th>Ostatnio</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.map((row, idx) => {
                  const pct = Math.min(100, Math.round((row.eco / topScore) * 100));
                  return (
                    <tr 
                      key={row.isCurrentUser ? "current-user" : row.name} 
                      className={`${row.isCurrentUser ? s.currentUserRow : ""} ${row.isCurrentUser && isPayoutAnimating ? s.payoutAnim : ""}`}
                    >
                      <td className={s.rank}>
                        <span className={`${s.medal} ${idx === 0 ? s.gold : idx === 1 ? s.silver : idx === 2 ? s.bronze : ""}`}>
                          {idx + 1}
                        </span>
                      </td>
                      <td className={s.person}>
                        <span className={s.avatar}>{row.name.split(" ").map(n => n[0]).slice(0, 2).join("")}</span>
                        <span className={s.name}>{row.name} {row.isCurrentUser && <small className={s.youBadge}>(Ty)</small>}</span>
                      </td>
                      <td className={s.eco}>
                        <strong className={s.coinsCount}>{row.eco.toLocaleString("pl-PL")}</strong>
                        <span className={s.unit}> EC</span>
                      </td>
                      <td className={s.progressCol}>
                        <div className={s.barContainer}><div className={s.bar} style={{ width: `${pct}%` }} /></div>
                      </td>
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