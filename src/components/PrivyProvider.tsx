import { PrivyProvider as PrivyAuthProvider } from "@privy-io/react-auth";
import { ReactNode } from "react";

// Define the environment variables needed for Privy
const PRIVY_APP_ID = import.meta.env.VITE_PRIVY_APP_ID || "";

interface PrivyProviderProps {
  children: ReactNode;
}

export function PrivyProvider({ children }: PrivyProviderProps) {
  if (!PRIVY_APP_ID) {
    console.warn("Privy App ID is not set. Authentication will not work properly.");
  }

  return (
    <PrivyAuthProvider
      appId={PRIVY_APP_ID}
      // Using inline config to avoid type issues
      config={{
        appearance: {
          theme: "light",
          accentColor: "#3b82f6",
          logo: "/images/MedFund_Logo.png",
        },
        loginMethods: ["email", "google", "discord", "wallet"],
      }}
    >
      {children}
    </PrivyAuthProvider>
  );
} 