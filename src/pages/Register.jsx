import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { useNotify } from "../ui/useNotify.js";
import { authErrorPL, authErrorFields } from "../utils/authErrorsPL.js";
import s from "../styles/Register.module.scss";

export default function Register() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [emailErr, setEmailErr] = useState(false);
  const [passErr, setPassErr] = useState(false);

  const { registerUser } = useAuth();
  const nav = useNavigate();
  const notify = useNotify();

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setEmailErr(false);
    setPassErr(false);

    try {
      await registerUser(email.trim(), password, displayName.trim());
      notify.success("Konto utworzone pomyślnie.");
      // notify.info("Możesz włączyć 2FA w profilu.");
      nav("/profil");
    } catch (err) {
      const code = err?.code;
      // zmapuj, które pola podświetlić
      const fields = authErrorFields(code);
      setEmailErr(fields.has("email"));
      setPassErr(fields.has("password"));

      notify.error(authErrorPL(code));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className={s.container}>
      <div className={s.box}>
        <h2 className={s.title}>Rejestracja</h2>
        <form onSubmit={submit} className={s.form}>
          <label className={s.label}>
            Nazwa wyświetlana
            <input
              className={s.input}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              type="text"
              placeholder="Twoje imię"
              autoComplete="nickname"
            />
          </label>

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
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passErr) setPassErr(false);
              }}
              type="password"
              autoComplete="new-password"
              required
              aria-invalid={passErr || undefined}
            />
          </label>

          <button className={s.button} type="submit" disabled={loading}>
            {loading ? "Zakładanie..." : "Załóż konto"}
          </button>
        </form>

        <p className={s.link}>
          Masz już konto? <Link to="/logowanie">Zaloguj się</Link>
        </p>
      </div>
    </section>
  );
}
