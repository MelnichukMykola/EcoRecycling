// wiadomość PL
export function authErrorPL(code) {
  const map = {
    "auth/invalid-credential": "Nieprawidłowy e-mail lub hasło.",
    "auth/wrong-password": "Nieprawidłowy e-mail lub hasło.",
    "auth/user-not-found": "Konto z tym adresem nie istnieje.",
    "auth/invalid-email": "Nieprawidłowy adres e-mail.",
    "auth/missing-password": "Podaj hasło.",
    "auth/too-many-requests": "Zbyt wiele prób. Spróbuj ponownie później.",
    "auth/network-request-failed": "Błąd sieci. Sprawdź połączenie.",
    "auth/user-disabled": "Konto zostało wyłączone.",
    "auth/weak-password": "Hasło jest za słabe (min. 6 znaków).",
    "auth/email-already-in-use": "E-mail jest już używany.",
    "auth/operation-not-allowed": "Operacja niedozwolona.",
    "auth/requires-recent-login":
      "Operacja wymaga ponownego logowania. Zaloguj się i spróbuj ponownie.",
    "auth/multi-factor-auth-required":
      "Wpisz kod z aplikacji uwierzytelniającej.",
  };
  return map[code] || "Coś poszło nie tak. Spróbuj ponownie.";
}

// które pola zaznaczyć jako błędne
export function authErrorFields(code) {
  const map = {
    "auth/invalid-email": ["email"],
    "auth/missing-password": ["password"],
    "auth/wrong-password": ["email", "password"],
    "auth/user-not-found": ["email", "password"],
    "auth/invalid-credential": ["email", "password"],
    // przy too-many-requests zwykle nie podświetlamy pól, to limit rate
  };
  return new Set(map[code] || []);
}
