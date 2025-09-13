import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext.jsx";
import { Link } from "react-router-dom";
import s from "../styles/Profil.module.scss";

export default function Profil() {
    const { user, updateDisplayName, changePassword } = useAuth();
    const [displayName, setDisplayName] = useState(user?.displayName || "");
    const [newPassword, setNewPassword] = useState("");
    const [msg, setMsg] = useState("");

    if (!user) return <p>Brak danych użytkownika.</p>;

    async function saveProfile(e) {
        e.preventDefault();
        setMsg("");
        try {
            await updateDisplayName(displayName);
            setMsg("Zapisano nazwę.");
        } catch (err) {
            setMsg(err.message);
        }
    }

    async function change(e) {
        e.preventDefault();
        setMsg("");
        try {
            await changePassword(newPassword);
            setNewPassword("");
            setMsg("Hasło zmienione.");
        } catch (err) {
            setMsg(err.message);
        }
    }

    return (
        <section className={s.container}>
            <h2 className={s.title}>Twój profil</h2>
            <p>
                Zalogowano jako: <strong>{user.email}</strong>
            </p>

            <form onSubmit={saveProfile} className={s.form} style={{ marginTop: 12 }}>
                <label className={s.label}>
                    Nazwa wyświetlana
                    <input className={s.input} value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                </label>
                <button className={s.button} type="submit">
                    Zapisz profil
                </button>
            </form>

            <form onSubmit={change} className={s.form} style={{ marginTop: 12 }}>
                <label className={s.label}>
                    Nowe hasło
                    <input
                        className={s.input}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        type="password"
                        placeholder="min 6 znaków"
                    />
                </label>
                <button className={s.button} type="submit">
                    Zmień hasło
                </button>
            </form>

            <div className={s.link} style={{ marginTop: 12 }}>
                <Link to="/2fa">Skonfiguruj 2FA (TOTP)</Link>
            </div>

            {msg && <p className={s.message}>{msg}</p>}
        </section>
    );
}
