import React, { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import { useNotify } from "../ui/useNotify.js";
import s from "../styles/Profil.module.scss";

export default function SupportForm({ user }) {
  const formRef = useRef();
  const notify = useNotify();
  const [loading, setLoading] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .sendForm(
        "service_8q1qwkl",
        "template_jb30rue",
        formRef.current,
        "IQfw36NOOIk3Fq4_f"
      )
      .then(() => {
        notify.success(
          "Wiadomość została wysłana! Odpowiemy najszybciej jak to możliwe."
        );
        formRef.current.reset();
      })
      .catch((error) => {
        notify.error(
          "Wystąpił błąd podczas wysyłania. Spróbuj ponownie później."
        );
        console.error("EmailJS Error:", error);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className={s.panel}>
      <form ref={formRef} onSubmit={sendEmail} className={s.form}>
        <p className={s.note}>Masz pytanie lub problem? Napisz do nas!</p>

        <label className={s.label}>
          Imię i Nazwisko
          <input
            className={s.input}
            name="user_name"
            defaultValue={user?.displayName || ""}
            required
          />
        </label>

        <label className={s.label}>
          Twój adres E-mail
          <input
            className={s.input}
            type="email"
            name="user_email"
            defaultValue={user?.email || ""}
            required
          />
        </label>

        <label className={s.label}>
          Temat zgłoszenia
          <select className={s.input} name="subject" required>
            <option value="Problem techniczny">Problem techniczny</option>
            <option value="Pytanie o EcoCoins">Pytanie o EcoCoins</option>
            <option value="Błąd w aplikacji">Zgłoszenie błędu</option>
            <option value="Inne">Inne</option>
          </select>
        </label>

        <label className={s.label}>
          Wiadomość
          <textarea
            className={s.input}
            name="message"
            rows="5"
            placeholder="Opisz swój problem..."
            required
            style={{ resize: "vertical", minHeight: "120px" }}
          />
        </label>

        <button className={s.button} type="submit" disabled={loading}>
          {loading ? "Wysyłanie..." : "Wyślij zgłoszenie"}
        </button>
      </form>
    </div>
  );
}
