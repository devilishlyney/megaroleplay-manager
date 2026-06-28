import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from 'react-router-dom'
import App from "./App";
import Header from './view/component/Header';
import "./view/assets/css/App.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './controller/context/AuthContext';
import HomeButton from "./view/component/home-button/HomeButton";

const queryClient = new QueryClient()
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <HomeButton />
          <Header />
          <App />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);