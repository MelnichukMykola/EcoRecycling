import React from "react";
import { Loader2 } from "lucide-react";
import s from "../styles/Loader.module.scss";

export default function Loader({ fullscreen = false, label = "Ładowanie..." }) {
  return (
    <div
      className={fullscreen ? s.fullscreen : s.inline}
      role="status"
      aria-live="polite"
    >
      <Loader2 className={s.icon} aria-hidden="true" />
      <span className={s.text}>{label}</span>
    </div>
  );
}
