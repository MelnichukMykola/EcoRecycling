import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase.js";
import { useNotify } from "../ui/useNotify.js";
import { authErrorPL } from "../utils/authErrorsPL.js";
import s from "../styles/ResetHasla.module.scss";
import ResetHelp from "../components/ResetHelp.jsx";
import ResetFaq from "../components/ResetFaq.jsx";

export default function ResetHasla() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const notify = useNotify();
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim(), {
        url: `${window.location.origin}${import.meta.env.BASE_URL}logowanie`,
        handleCodeInApp: false,
      });
      setEmail("");
      notify.success("Wysłaliśmy e-mail z linkiem do resetu hasła.");
    } catch (err) {
      notify.error(authErrorPL(err?.code));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <section className={s.container}>
        <div className={s.box} role="region" aria-labelledby="reset-title">
          {/* банер із лісом */}
          <div className={s.banner} role="img" aria-label="Las — ilustracja" />

          <div className={s.header}>
            <span className={s.iconCircle} aria-hidden>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M7 10V7a5 5 0 1 1 10 0v3"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <rect
                  x="5"
                  y="10"
                  width="14"
                  height="10"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </span>
            <div>
              <h2 id="reset-title" className={s.title}>
                Reset hasła
              </h2>
              <p className={s.subtitle}>
                Wpisz swój e-mail — wyślemy bezpieczny link do zmiany hasła.
              </p>
            </div>
          </div>

          <form onSubmit={submit} className={s.form}>
            <label className={s.label}>
              E-mail
              <input
                className={s.input}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                placeholder="twoj@email.com"
              />
            </label>

            <div className={s.actions}>
              <button className={s.button} type="submit" disabled={loading}>
                {loading ? "Wysyłanie..." : "Wyślij link"}
              </button>
              <button
                type="button"
                className={s.btnGhost}
                onClick={() => nav("/logowanie")}
              >
                Powrót do logowania
              </button>
            </div>
          </form>

          <p className={s.helper}>
            Jeśli nie widzisz wiadomości — sprawdź folder <strong>Spam</strong>{" "}
            lub
            <strong> Oferty</strong>.
          </p>
        </div>
      </section>
      {/* <ResetHelp />
      <ResetFaq /> */}
      
    </>
  );
}
