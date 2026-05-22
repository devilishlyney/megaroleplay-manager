import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import StatsForm from "./view/StatsForm";
import ThemeToggle from './view/assets/theme-toggle/ThemeToggle';
import "./view/assets/css/App.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeToggle />
    <StatsForm onNext={(stats) => console.log("Selected Stats:", stats)} />
  </React.StrictMode>,
);
