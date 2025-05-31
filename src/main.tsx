import './polyfill';
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { PrivyProvider } from "@privy-io/react-auth";
import App from "./App";
import "./index.css";
import CardanoWalletProvider from "./components/CardanoWalletProvider";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from 'next-themes';
import axios from 'axios';

// This Privy app ID is for development only. For production, you should use your own Privy app ID.
const PRIVY_APP_ID = "cm9u2p5us002bib0lrmk95mcs";

// Configure axios defaults
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        loginMethods: ["google", "twitter"],
        appearance: {
          theme: "light",
          accentColor: "#3b82f6",
          logo: "/images/MedFund_Logo.png",
        },
        embeddedWallets: {
          createOnLogin: "users-without-wallets"
        }
      }}
    >
      <CardanoWalletProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </ThemeProvider>
          {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
      </CardanoWalletProvider>
    </PrivyProvider>
  </React.StrictMode>
);
