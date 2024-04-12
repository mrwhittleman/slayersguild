import { DAppKitProvider } from "@vechain/dapp-kit-react";
import type { WalletConnectOptions } from "@vechain/dapp-kit";
import { useTheme } from "next-themes";
import { Outlet } from "react-router-dom";
import { NETWORK, NODE_URL, WALLET_CONNECT_PROJECT_ID } from "@/config/index";
import { ThemeProvider } from "@/components/theme-provider";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import { Toaster } from "./components/ui/toaster";
import Socialmedia from "./components/Socialmedia";

const walletConnectOptions: WalletConnectOptions = {
  projectId: WALLET_CONNECT_PROJECT_ID,
  metadata: {
    name: "VeChain Slayers Guild",
    description: "..",
    url: window.location.origin,
    icons: [`https://vet.domains/assets/walletconnect.png`],
  },
};

export default function Layout() {
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <DappKitContainer>
          <main className="flex justify-center">
            <div className="flex flex-col items-center w-full max-w-10xl min-h-screen overflow-clip">
              <Navigation />
              <Socialmedia />
              <div className="flex w-full h-full px-4 lg:px-12 4k:px-0 py-12">
                <Outlet />
              </div>
              <Footer />
            </div>
          </main>
          <Toaster />
        </DappKitContainer>
      </ThemeProvider>
    </>
  );
}

function DappKitContainer({ children }: { children: React.ReactNode }) {
  const { resolvedTheme: theme } = useTheme();

  return (
    <DAppKitProvider
      nodeUrl={NODE_URL}
      genesis={NETWORK}
      usePersistence
      walletConnectOptions={walletConnectOptions}
      themeMode={theme === "dark" ? "DARK" : "LIGHT"}
    >
      {children}
    </DAppKitProvider>
  );
}
