import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from 'react-router-dom'
import App from "./App";
import StatsForm from "./view/StatsForm";
import ThemeToggle from './view/assets/theme-toggle/ThemeToggle';
import "./view/assets/css/App.css";
import { Routes, Route } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeToggle />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/stats" element={<StatsForm onNext={(stats) => console.log("Selected Stats:", stats)} />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);