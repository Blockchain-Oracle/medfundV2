import './polyfill';
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { PrivyProvider } from "@privy-io/react-auth";
import App from "./App";
import "./index.css";
import CardanoWalletProvider from "./components/CardanoWalletProvider";

// This Privy app ID is for development only. For production, you should use your own Privy app ID.
const PRIVY_APP_ID = "cm9u2p5us002bib0lrmk95mcs";

ReactDOM.createRoot(document.getElementById("root")!).render(
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
      }}
    >
      <CardanoWalletProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </CardanoWalletProvider>
    </PrivyProvider>
  </React.StrictMode>
);
