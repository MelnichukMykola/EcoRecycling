import React, { useState } from "react";
import QRCode from "qrcode";
import { auth } from "../../firebase";
import { multiFactor, TotpMultiFactorGenerator } from "firebase/auth";
// import s from "../styles/TwoFA.module.scss";

export default function TwoFA() {
    const [uri, setUri] = useState("");
    const [qr, setQr] = useState("");
    const [kod, setKod] = useState("");
    const [msg, setMsg] = useState("");
    const [enrolled, setEnrolled] = useState(false);

    async function start() {
        setMsg("");
        try {
            const mfa = multiFactor(auth.currentUser);
            const session = await mfa.getSession();
            // tworzymy sekret i URI do aplikacji uwierzytelniającej
            const secret = await TotpMultiFactorGenerator.generateSecret(session, {
                accountName: auth.currentUser.email || "EcoApp",
                issuer: "EcoApp",
            });
            setUri(secret.uri);
            const dataUrl = await QRCode.toDataURL(secret.uri);
            setQr(dataUrl);
            // zachowujemy sekret tymczasowo, by móc potwierdzić
            window.__eco_totp_secret = secret;
        } catch (err) {
            setMsg(err.message);
        }
    }

    async function confirm(e) {
        e.preventDefault();
        setMsg("");
        try {
            const secret = window.__eco_totp_secret;
            if (!secret) {
                setMsg("Najpierw wygeneruj kod i zeskanuj QR.");
                return;
            }
            // użytkownik wpisuje 6-cyfrowy kod z aplikacji
            const assertion = TotpMultiFactorGenerator.assertionForEnrollment(secret, kod);
            const mfa = multiFactor(auth.currentUser);
            await mfa.enroll(assertion, "TOTP");
            setEnrolled(true);
            setMsg("2FA (TOTP) włączone dla Twojego konta.");
            setUri("");
            setQr("");
            setKod("");
            delete window.__eco_totp_secret;
        } catch (err) {
            setMsg(err.message);
        }
    }

    return (
        <section>
            <h2>Dwuskładnikowe logowanie (TOTP)</h2>

            {!enrolled && (
                <>
                    <p>Krok 1: Wygeneruj sekret i zeskanuj kod QR w aplikacji (Google Authenticator / Authy / 1Password).</p>
                    <button onClick={start}>Generuj kod TOTP</button>

                    {qr && (
                        <div style={{ marginTop: 12 }}>
                            <img src={qr} alt="QR do TOTP" style={{ maxWidth: 240 }} />
                            <p style={{ marginTop: 8, fontSize: 12, opacity: 0.8 }}>
                                Jeśli nie możesz zeskanować, użyj URI: <code>{uri}</code>
                            </p>

                            <form onSubmit={confirm} style={{ display: "grid", gap: 8, maxWidth: 240, marginTop: 12 }}>
                                <label>
                                    Kod z aplikacji <input value={kod} onChange={(e) => setKod(e.target.value)} placeholder="000000" />
                                </label>
                                <button type="submit">Potwierdź i włącz</button>
                            </form>
                        </div>
                    )}
                </>
            )}

            {enrolled && (
                <div style={{ marginTop: 12 }}>
                    <p>2FA aktywne. Przy następnym logowaniu zostaniesz poproszony o kod z aplikacji.</p>
                </div>
            )}

            {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
        </section>
    );
}
