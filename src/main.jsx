import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import NotifyProvider from "./ui/NotifyProvider.jsx";
import "./styles/global.scss";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.VITE_BASE}>
      <NotifyProvider>
        <App />
      </NotifyProvider>
    </BrowserRouter>
  </React.StrictMode>
);
