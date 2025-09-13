import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import s from "../styles/Register.module.scss";

export default function Register() {
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");
    const { registerUser } = useAuth();
    const nav = useNavigate();

    async function submit(e) {
        e.preventDefault();
        setMsg("");
        try {
            await registerUser(email, password, displayName);
            setMsg("Konto utworzone. Możesz skonfigurować 2FA w profilu.");
            nav("/profil");
        } catch (err) {
            setMsg(err.message);
        }
    }

    return (
        <section className={s.container}>
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
                    />
                </label>
                <label className={s.label}>
                    E-mail
                    <input className={s.input} value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
                </label>
                <label className={s.label}>
                    Hasło
                    <input className={s.input} value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
                </label>
                <button className={s.button} type="submit">
                    Załóż konto
                </button>
            </form>
            {msg && <p className={s.message}>{msg}</p>}
            <p className={s.link}>
                Masz już konto? <Link to="/logowanie">Zaloguj się</Link>
            </p>
        </section>
    );
}
