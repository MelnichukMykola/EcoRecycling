import React from "react";
import { SnackbarProvider, closeSnackbar } from "notistack";
import { X } from "lucide-react";

export default function NotifyProvider({ children }) {
  return (
    <SnackbarProvider
      maxSnack={3}
      autoHideDuration={3000}
      preventDuplicate
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      action={(id) => (
        <button
          onClick={() => closeSnackbar(id)}
          aria-label="Zamknij"
          title="Zamknij"
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            padding: 4,
            marginLeft: 8,
          }}
        >
          <X size={18} />
        </button>
      )}
    >
      {children}
    </SnackbarProvider>
  );
}
