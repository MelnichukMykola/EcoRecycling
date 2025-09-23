# EkoRecykling

Aplikacja webowa (React + Vite), w której użytkownicy **zarabiają EcoCoins za recykling odpadów**. Projekt zawiera pełny przepływ uwierzytelniania (rejestracja, logowanie, reset i zmiana hasła), profil użytkownika, powiadomienia oraz stylowanie w SCSS Modules.

> [Live:](https://melnichukmykola.github.io/EcoRecycling/)

---

## 🎯 Funkcje

- Rejestracja i logowanie (Firebase Auth: e-mail + hasło) — [src/pages/Register.jsx](./src/pages/Register.jsx), [src/pages/Login.jsx](./src/pages/Login.jsx)
- Reset i **zmiana hasła** — [src/pages/ResetHasla.jsx](./src/pages/ResetHasla.jsx), [src/pages/Profil.jsx](./src/pages/Profil.jsx)
- Profil użytkownika (edycja nazwy wyświetlanej) — [src/pages/Profil.jsx](./src/pages/Profil.jsx)
- Powiadomienia **notistack** — [src/ui/NotifyProvider.jsx](./src/ui/NotifyProvider.jsx), [src/ui/useNotify.js](./src/ui/useNotify.js)
- SCSS Modules + prosty design system — [src/styles](./src/styles)
- Ikony **lucide-react**
- „Saldo” **EcoCoins** (na razie lokalnie; start od 0 – logika naliczania w planie) — [src/coins/useCoins.js](./src/coins/useCoins.js)
- Gotowy **deploy na GitHub Pages** z poprawnym SPA fallback (404 → index.html)

---

## 🧰 Stos technologiczny

- **React 18/19** + **Vite**
- **Firebase Auth** (email/password) — [src/auth/AuthContext.jsx](./src/auth/AuthContext.jsx), [firebase.js](./firebase.js)
- **notistack** (Snackbary)
- **SCSS Modules**
- **lucide-react** (ikony)
- Deploy: **gh-pages**

---

## 📦 Struktura

```
src/
  auth/            # kontekst Auth (AuthContext)
  coins/           # hook useCoins (saldo w localStorage)
  components/      # np. Nav
  pages/           # Home, Login, Register, ResetHasla, Profil, TwoFA
  styles/          # SCSS modules + global.scss
  ui/              # NotifyProvider + useNotify (notistack)
  utils/           # mapowanie błędów Firebase (authErrorsPL)
firebase.js        # inicjalizacja Firebase
scripts/copy-404.js# kopia dist/index.html -> dist/404.html (SPA fallback)
vite.config.js     # base dla GH Pages
```

---

## 📌 Plan projektu (moduły)

1. **Rejestracja użytkowników** — e-mail + hasło, walidacja, powiadomienia. **Status:** ✅ zrobione.
2. **Profil:** zmiana/odzyskiwanie hasła, **2FA (TOTP)**, edycja nazwy. **Status:** ✅🟡 zrobione nie do koncu.
3. **Portfel** — saldo **EcoCoins**, historia transakcji, szczegóły operacji; w przyszłości: wypłaty/nagrody, eksport CSV. **Status:** 🟡 planowane.
4. **Agregacja danych** — zestawienia masy/rodzajów odpadów wg użytkownika/punktu/okresu, wykresy; eksport CSV/XLSX. **Status:** 🟡 planowane.
5. **Strona rankingowa** — top użytkowników/punktów (np. wg kg/MWh/EcoCoins), filtry i okresy, anty-cheat. **Status:** 🟡 planowane.
6. **Kalkulator** — przelicznik EcoCoins na podstawie masy i kategorii (plastik, szkło, papier, elektro), taryfy konfigurowalne w panelu. **Status:** 🟡 planowane.
7. **Generator wydruków dokumentów przyjęcia (PDF)** — potwierdzenie oddania odpadów (dane użytkownika, punkt, masa, data, kod QR/podpis). **Status:** 🟡 planowane.
8. **Wysyłka maili** — potwierdzenia transakcji, załączniki PDF, alerty o zmianach salda; (reset hasła już zapewnia Firebase). **Status:** 🟡 planowane.
9. **Support @** — formularz kontaktowy + FAQ; zgłoszenia trafiają na e-mail/Helpdesk, automatyczne potwierdzenie dla użytkownika. **Status:** 🟡 planowane.
10. **(Dodatkowo) Panel administratora** — zarządzanie punktami zbiórki, taryfami, weryfikacja zgłoszeń i statystyki. **Status:** 🟡 planowane.

> Legenda: ✅ zrobione · 🔧 w toku · 🟡 planowane.

---

## 🚀 Szybki start (dev)

1. **Zależności**

```bash
npm i
```

2. **Konfiguracja Firebase**  
   Utwórz projekt w Firebase, dodaj **aplikację web** i skopiuj config (Project settings → Your apps).

**A. Pliki `.env` (zalecane)**  
Utwórz:

```
.env.development
.env.production
```

i wstaw:

```bash
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_APP_ID=...

# jeśli deploy na GitHub Pages:
VITE_BASE=/NazwaTwojegoRepozytorium/
```

**B. Bez `.env`**  
Wklej konfigurację bezpośrednio do [firebase.js](./firebase.js).

3. **Start**

```bash
npm run dev
```

Aplikacja uruchomi się na `http://localhost:5173`.

---

## 🔒 Uwierzytelnianie (Firebase)

1. **Authentication → Sign-in method**: włącz **Email/Password**.
2. (Opcjonalnie) **Multi-factor authentication**: włącz **TOTP**.
3. Użytkownik konfiguruje 2FA w **Profil → Skonfiguruj 2FA (TOTP)** — generowany jest sekret i kod QR.

Mapowanie komunikatów błędów Firebase na polskie: [src/utils/authErrorsPL.js](./src/utils/authErrorsPL.js)

---

## 🧪 Skrypty

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "postbuild": "node scripts/copy-404.js",
  "preview": "vite preview",
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

---

## 🌐 Deploy na GitHub Pages

1. **Vite `base`**  
   W [vite.config.js](./vite.config.js) ustaw:

```js
export default defineConfig({
  plugins: [react()],
  base: "/NazwaTwojegoRepozytorium/",
});
```

Jeśli korzystasz z `.env`, możesz użyć `import.meta.env.BASE_URL` jako `basename` w `BrowserRouter`.

2. **Ścieżki do zasobów**  
   Dla plików z `public/` używaj:

```jsx
<img src={`${import.meta.env.BASE_URL}cannabis.svg`} />
```

albo importów z `src/assets`:

```jsx
import logoUrl from "../assets/cannabis.svg";
<img src={logoUrl} />;
```

3. **SPA fallback (404)**  
   Po buildzie skrypt [scripts/copy-404.js](./scripts/copy-404.js) kopiuje `dist/index.html` → `dist/404.html`, aby `/profil` itp. nie dawały 404.

4. **Publikacja**

```bash
npm run deploy
```

Po chwili strona będzie pod `https://twoj-login.github.io/NazwaTwojegoRepozytorium/`.

---

## 🧱 Wzorce i UX

- Walidacja pól (czerwone podświetlenie) — Logowanie/Rejestracja/Profil
- Powiadomienia `notistack` (sukces, błąd, info)
- ARIA (`aria-invalid` itd.)
- Stylowanie: SCSS Modules, mixiny, spójne przyciski

---

**Autorzy:**  
EkoRecykling — projekt szkolny / demo funkcjonalne. Jeśli chcesz dodać funkcję lub zgłosić błąd, utwórz _Issue_ lub _PR_. 💚♻️
