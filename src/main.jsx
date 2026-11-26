
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles/global.css";

// GitHub Pages 내부 페이지 이동 처리
document.addEventListener("click", (event) => {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    event.metaKey
  ) {
    return;
  }

  const link = event.target.closest?.("a[href]");

  if (!link || link.hasAttribute("download")) return;
  if (link.target && link.target !== "_self") return;

  const href = link.getAttribute("href");

  const routes = [
    "/",
    "/main",
    "/exam/schedule",
    "/exam/apply",
  ];

  if (!routes.includes(href)) return;

  event.preventDefault();
  window.location.hash = "#" + href;
});

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
