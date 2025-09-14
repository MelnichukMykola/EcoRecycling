import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import {
  getMultiFactorResolver,
  TotpMultiFactorGenerator,
} from "firebase/auth";
import { auth } from "../../firebase.js";
import { useNotify } from "../ui/useNotify.js";
import { authErrorPL, authErrorFields } from "../utils/authErrorsPL.js";
import s from "../styles/Login.module.scss";

export default function Login() {
  const [email, setEmail] = useState("");
  const [haslo, setHaslo] = useState("");
  const [resolver, setResolver] = useState(null);
  const [kod, setKod] = useState("");
  const [loading, setLoading] = useState(false);

  const [emailErr, setEmailErr] = useState(false);
  const [passErr, setPassErr] = useState(false);
  const [totpErr, setTotpErr] = useState(false);

  const { signIn } = useAuth();
  const nav = useNavigate();
  const notify = useNotify();

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setEmailErr(false);
    setPassErr(false);

    try {
      await signIn(email.trim(), haslo);
      notify.success("Zalogowano pomyślnie.");
      nav("/profil");
    } catch (err) {
      if (err?.code === "auth/multi-factor-auth-required") {
        const r = getMultiFactorResolver(auth, err);
        setResolver(r);
        notify.info("Podaj kod z aplikacji 2FA.");
      } else {
        const code = err?.code;
        const fields = authErrorFields(code);
        setEmailErr(fields.has("email"));
        setPassErr(fields.has("password"));
        notify.error(authErrorPL(code));
      }
    } finally {
      setLoading(false);
    }
  }

  async function confirmMfa(e) {
    e.preventDefault();
    setLoading(true);
    setTotpErr(false);
    try {
      const totpHint =
        resolver.hints.find((h) => h.factorId === "totp") || resolver.hints[0];
      const assertion = TotpMultiFactorGenerator.assertionForSignIn(
        totpHint.uid,
        kod
      );
      await resolver.resolveSignIn(assertion);
      notify.success("Zalogowano (2FA).");
      nav("/profil");
    } catch (err) {
      setTotpErr(true);
      notify.error(authErrorPL(err?.code));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className={s.container}>
      <div className={s.box}>
        <h2 className={s.title}>Logowanie</h2>

        {!resolver ? (
          <form onSubmit={submit} className={s.form}>
            <label className={s.label}>
              E-mail
              <input
                className={`${s.input} ${emailErr ? s.inputError : ""}`}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailErr) setEmailErr(false);
                }}
                type="email"
                autoComplete="username"
                required
                aria-invalid={emailErr || undefined}
              />
            </label>
            <label className={s.label}>
              Hasło
              <input
                className={`${s.input} ${passErr ? s.inputError : ""}`}
                value={haslo}
                onChange={(e) => {
                  setHaslo(e.target.value);
                  if (passErr) setPassErr(false);
                }}
                type="password"
                autoComplete="current-password"
                required
                aria-invalid={passErr || undefined}
              />
            </label>
            <button className={s.button} type="submit" disabled={loading}>
              {loading ? "Logowanie..." : "Zaloguj"}
            </button>
          </form>
        ) : (
          <form onSubmit={confirmMfa} className={s.form}>
            <label className={s.label}>
              Kod TOTP
              <input
                className={`${s.input} ${totpErr ? s.inputError : ""}`}
                value={kod}
                onChange={(e) => {
                  setKod(e.target.value);
                  if (totpErr) setTotpErr(false);
                }}
                placeholder="000000"
                inputMode="numeric"
                aria-invalid={totpErr || undefined}
              />
            </label>
            <button className={s.button} type="submit" disabled={loading}>
              {loading ? "Potwierdzanie..." : "Potwierdź"}
            </button>
          </form>
        )}

        <p className={s.link}>
          <Link to="/reset-hasla">Nie pamiętasz hasła?</Link>
        </p>
        <p className={s.link}>
          Nie masz konta? <Link to="/rejestracja">Zarejestruj się</Link>
        </p>
      </div>
    </section>
  );
}
