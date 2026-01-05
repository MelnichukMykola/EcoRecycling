import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext.jsx";
import { useCoins } from "../coins/useCoins.js";
import { useNotify } from "../ui/useNotify.js";
import { authErrorPL } from "../utils/authErrorsPL.js";
import s from "../styles/Profil.module.scss";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  getMultiFactorResolver,
  TotpMultiFactorGenerator,
} from "firebase/auth";
import { auth } from "../../firebase.js";
import SupportForm from "../components/SupportForm.jsx";

export default function Profil() {
  const { user, updateDisplayName, changePassword } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [tab, setTab] = useState("overview");
  const [history, setHistory] = useState([]);
  const notify = useNotify();

  const { balance } = useCoins(user?.uid);

  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showReauth, setShowReauth] = useState(false);
  const [currentPass, setCurrentPass] = useState("");
  const [totp, setTotp] = useState("");
  const [resolver, setResolver] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      const savedHistory =
        JSON.parse(localStorage.getItem(`history_${user.uid}`)) || [];
      setHistory(savedHistory);
    }
  }, [user, tab]);

  const clearHistory = () => {
    if (window.confirm("Czy na pewno chcesz wyczyścić historię?")) {
      localStorage.removeItem(`history_${user.uid}`);
      setHistory([]);
    }
  };

  if (!user) return <p>Brak danych użytkownika.</p>;

  async function saveProfile(e) {
    e.preventDefault();
    try {
      await updateDisplayName(displayName.trim());
      notify.success("Zapisano nazwę profilu.");
    } catch (err) {
      notify.error(authErrorPL(err?.code));
    }
  }

  async function doUpdatePassword(finalPassword) {
    await changePassword(finalPassword);
  }

  async function startChangePassword(e) {
    e.preventDefault();
    if (newPass.length < 6) {
      notify.error("Hasło musi mieć co najmniej 6 znaków.");
      return;
    }
    if (newPass !== confirmPass) {
      notify.error("Hasła nie są takie same.");
      return;
    }
    setLoading(true);
    try {
      await doUpdatePassword(newPass);
      setNewPass("");
      setConfirmPass("");
      notify.success("Hasło zmienione.");
    } catch (err) {
      if (
        err?.code === "auth/requires-recent-login" ||
        err?.code === "auth/multi-factor-auth-required"
      ) {
        if (err?.code === "auth/multi-factor-auth-required") {
          const r = getMultiFactorResolver(auth, err);
          setResolver(r);
        }
        setShowReauth(true);
        notify.info("Potwierdź tożsamość, aby zmienić hasło.");
      } else {
        notify.error(authErrorPL(err?.code));
      }
    } finally {
      setLoading(false);
    }
  }

  async function confirmReauth(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const cred = EmailAuthProvider.credential(user.email, currentPass);
      try {
        await reauthenticateWithCredential(auth.currentUser, cred);
      } catch (err) {
        if (err?.code === "auth/multi-factor-auth-required") {
          const r = getMultiFactorResolver(auth, err);
          setResolver(r);
        } else {
          throw err;
        }
      }

      if (resolver) {
        const totpHint =
          resolver.hints.find((h) => h.factorId === "totp") ||
          resolver.hints[0];
        const assertion = TotpMultiFactorGenerator.assertionForSignIn(
          totpHint.uid,
          totp
        );
        await resolver.resolveSignIn(assertion);
      }

      await doUpdatePassword(newPass);
      setShowReauth(false);
      setCurrentPass("");
      setTotp("");
      setNewPass("");
      setConfirmPass("");
      notify.success("Hasło zmienione.");
    } catch (err) {
      notify.error(authErrorPL(err?.code));
    } finally {
      setLoading(false);
    }
  }

  const exportToCSV = () => {
    if (history.length === 0) return;

    // Nagłówki
    const headers = ["Data", "Material", "Ilosc (EC)"];

    // Naprawa formatu: cudzysłowy zapobiegają rozbijaniu kolumn przez przecinki
    const rows = history.map((item) => [
      `"${item.date}"`,
      `"${item.material}"`,
      `"${item.amount}"`,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((e) => e.join(",")),
    ].join("\n");

    // Dodanie BOM (\ufeff), aby polskie znaki działały w Excelu/Numbers
    const blob = new Blob(["\ufeff", csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    // Czytelna nazwa: historia_2026-01-03.csv
    const dateStr = new Date().toISOString().split("T")[0];
    link.download = `historia_recyklingu_${dateStr}.csv`;

    link.click();
    URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    if (history.length === 0) return;

    const doc = new jsPDF();
    const dateStr = new Date().toISOString().split("T")[0];

    doc.setFontSize(18);
    doc.setTextColor(31, 109, 98);
    doc.text("Raport EcoCoins", 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Uzytkownik: ${user.email}`, 14, 28);

    const tableColumn = ["Data", "Material", "Suma"];
    const tableRows = history.map((item) => [
      item.date,
      item.material,
      `${item.amount} EC`,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 35,
      theme: "striped",
      headStyles: { fillColor: [31, 109, 98] },
      styles: { font: "helvetica" },
    });

    doc.save(`historia_recyklingu_${dateStr}.pdf`);
  };

  return (
    <section className={s.container}>
      <header className={s.head}>
        <h2 className={s.title}>Twój profil</h2>

        <div className={s.tabs}>
          <button
            className={`${s.tab} ${tab === "overview" ? s.tabActive : ""}`}
            onClick={() => setTab("overview")}
          >
            Przegląd
          </button>
          <button
            className={`${s.tab} ${tab === "history" ? s.tabActive : ""}`}
            onClick={() => setTab("history")}
          >
            Historia
          </button>
          <button
            className={`${s.tab} ${tab === "profile" ? s.tabActive : ""}`}
            onClick={() => setTab("profile")}
          >
            Ustawienia profilu
          </button>
          <button
            className={`${s.tab} ${tab === "password" ? s.tabActive : ""}`}
            onClick={() => setTab("password")}
          >
            Zmiana hasła
          </button>
          <button
            className={`${s.tab} ${tab === "support" ? s.tabActive : ""}`}
            onClick={() => setTab("support")}
          >
            Wsparcie
          </button>
        </div>
      </header>

      {/* Огляд */}
      {tab === "overview" && (
        <div className={s.panel}>
          <p className={s.signedAs}>
            Zalogowano jako: <strong>{user.email}</strong>
          </p>

          <div className={s.balanceCard}>
            <div className={s.balanceLabel}>Twój balans</div>
            <div className={s.balanceRow}>
              <div className={s.balanceValue}>{balance}</div>
              <span className={s.balanceUnit}>EcoCoins</span>
            </div>
          </div>
        </div>
      )}

      {tab === "history" && (
        <div className={s.panel}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <h3 style={{ margin: 0 }}>Historia recyklingu</h3>

            {history.length > 0 && (
              <div style={{ display: "flex", gap: "8px" }}>
                {/* Wybór formatu */}
                <button
                  onClick={exportToCSV}
                  className={s.linkBtn}
                  style={{ fontSize: "11px", height: "30px" }}
                >
                  💾 CSV
                </button>
                <button
                  onClick={exportToPDF}
                  className={s.linkBtn}
                  style={{
                    fontSize: "11px",
                    height: "30px",
                    background: "#7c3aed",
                    color: "white",
                    borderColor: "transparent",
                  }}
                >
                  📄 PDF
                </button>

                <div
                  style={{
                    width: "1px",
                    background: "#e2e8f0",
                    margin: "0 4px",
                  }}
                />

                <button
                  onClick={clearHistory}
                  className={s.linkBtn}
                  style={{ fontSize: "11px", height: "30px", color: "#ef4444" }}
                >
                  Wyczyścić historię
                </button>
              </div>
            )}
          </div>

          {history.length === 0 ? (
            <p className={s.note}>Brak zapisanych transakcji.</p>
          ) : (
            <div className={s.historyList}>
              {history.map((item) => (
                <div key={item.id} className={s.historyItem}>
                  <div className={s.historyInfo}>
                    <span className={s.historyMaterial}>{item.material}</span>
                    <span className={s.historyDate}>{item.date}</span>
                  </div>
                  <div className={s.historyAmount}>
                    +{item.amount} <small>EC</small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "profile" && (
        <div className={s.panel}>
          <form onSubmit={saveProfile} className={s.form}>
            <label className={s.label}>
              Nazwa użytkownika
              <input
                className={s.input}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </label>
            <button className={s.button} type="submit">
              Zapisz profil
            </button>
          </form>
        </div>
      )}

      {/* Зміна пароля */}
      {tab === "password" && (
        <div className={s.panel}>
          {!showReauth ? (
            <form onSubmit={startChangePassword} className={s.form}>
              <label className={s.label}>
                Nowe hasło
                <input
                  className={s.input}
                  type="password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="min 6 znaków"
                />
              </label>
              <label className={s.label}>
                Powtórz hasło
                <input
                  className={s.input}
                  type="password"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                />
              </label>
              <button className={s.button} type="submit" disabled={loading}>
                {loading ? "Zapisywanie..." : "Zmień hasło"}
              </button>
            </form>
          ) : (
            <form onSubmit={confirmReauth} className={s.form}>
              <p className={s.note}>
                Ze względów bezpieczeństwa potwierdź tożsamość.
              </p>
              <label className={s.label}>
                Aktualne hasło
                <input
                  className={s.input}
                  type="password"
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                />
              </label>

              <button className={s.button} type="submit" disabled={loading}>
                {loading ? "Potwierdzanie..." : "Potwierdź i zmień hasło"}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Підтримка */}
      {tab === "support" && <SupportForm user={user} />}
    </section>
  );
}
