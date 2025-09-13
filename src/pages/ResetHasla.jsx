import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext.jsx";
import s from "../styles/ResetHasla.module.scss";

export default function ResetHasla() {
    const [email, setEmail] = useState("");
    const [msg, setMsg] = useState("");
    const { resetPassword } = useAuth();

    async function submit(e) {
        e.preventDefault();
        setMsg("");
        try {
            await resetPassword(email);
            setMsg("Wysłaliśmy e-mail do resetu hasła.");
        } catch (err) {
            setMsg(err.message);
        }
    }

    return (
        <section className={s.container}>
            <h2 className={s.title}>Reset hasła</h2>
            <form onSubmit={submit} className={s.form}>
                <label className={s.label}>
                    E-mail
                    <input className={s.input} value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
                </label>
                <button className={s.button} type="submit">
                    Wyślij link
                </button>
            </form>
            {msg && <p className={s.message}>{msg}</p>}
        </section>
    );
}
