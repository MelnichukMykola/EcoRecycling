import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { getMultiFactorResolver, TotpMultiFactorGenerator } from "firebase/auth";
import { auth } from "../../firebase.js";
import s from "../styles/Login.module.scss";

export default function Login() {
    const [email, setEmail] = useState("");
    const [haslo, setHaslo] = useState("");
    const [msg, setMsg] = useState("");
    const [resolver, setResolver] = useState(null);
    const [kod, setKod] = useState("");
    const { signIn } = useAuth();
    const nav = useNavigate();

    async function submit(e) {
        e.preventDefault();
        setMsg("");
        try {
            await signIn(email, haslo);
            nav("/profil");
        } catch (err) {
            if (err?.code === "auth/multi-factor-auth-required") {
                const r = getMultiFactorResolver(auth, err);
                setResolver(r);
                setMsg("Wpisz kod z aplikacji uwierzytelniającej.");
            } else {
                setMsg(err.message);
            }
        }
    }

    async function confirmMfa(e) {
        e.preventDefault();
        try {
            const totpHint = resolver.hints.find((h) => h.factorId === "totp") || resolver.hints[0];
            const assertion = TotpMultiFactorGenerator.assertionForSignIn(totpHint.uid, kod);
            await resolver.resolveSignIn(assertion);
            nav("/profil");
        } catch (err) {
            setMsg(err.message);
        }
    }

    return (
        <section className={s.container}>
            <h2 className={s.title}>Logowanie</h2>

            {!resolver ? (
                <form onSubmit={submit} className={s.form}>
                    <label className={s.label}>
                        E-mail
                        <input className={s.input} value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
                    </label>
                    <label className={s.label}>
                        Hasło
                        <input className={s.input} value={haslo} onChange={(e) => setHaslo(e.target.value)} type="password" required />
                    </label>
                    <button className={s.button} type="submit">
                        Zaloguj
                    </button>
                </form>
            ) : (
                <form onSubmit={confirmMfa} className={s.form}>
                    <label className={s.label}>
                        Kod TOTP
                        <input className={s.input} value={kod} onChange={(e) => setKod(e.target.value)} placeholder="000000" />
                    </label>
                    <button className={s.button} type="submit">
                        Potwierdź
                    </button>
                </form>
            )}

            <p className={s.link}>
                <Link to="/reset-hasla">Nie pamiętasz hasła?</Link>
            </p>

            <p className={s.link}>
                Nie masz konta? <Link to="/rejestracja">Zarejestruj się</Link>
            </p>

            {msg && <p className={s.message}>{msg}</p>}
        </section>
    );
}
