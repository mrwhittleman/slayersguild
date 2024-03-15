import { DAppKitProvider } from '@vechain/dapp-kit-react';
import type { WalletConnectOptions } from '@vechain/dapp-kit';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { NETWORK, NODE_URL, WALLET_CONNECT_PROJECT_ID } from './config';
import { ThemeProvider } from "@/components/theme-provider"
import { useTheme } from "next-themes"
import Menu from './Menu';
import OfferingPage from "./Pages/Offering"
import AboutPage from './Pages/About';
import AltarPage from './Pages/Altar';
import GalleryPage from './Pages/Gallery';
import MySlayerPage from './Pages/MySlayer';

const walletConnectOptions: WalletConnectOptions = {
    projectId: WALLET_CONNECT_PROJECT_ID,
    metadata: {
        name: 'VeChain Slayers Guild',
        description: '..',
        url: window.location.origin,
        icons: [`https://vet.domains/assets/walletconnect.png`],
    },
};

export default function App() {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <DappKitContainer>
                <div className="bg-[#0c0e16] min-h-screen flex flex-col items-center justify-center text-white">
                    <BrowserRouter future={{ v7_startTransition: true }}>
                        <Menu />
                        <Routes>
                            <Route path="/offering" element={<OfferingPage />} />
                            <Route path="/about" element={<AboutPage />} />
                            <Route path="/my-slayer" element={<MySlayerPage />} />
                            <Route path="/gallery" element={<GalleryPage />} />
                            <Route path="/altar" element={<AltarPage />} />
                            <Route path="*" element={<OfferingPage />} />
                        </Routes>
                    </BrowserRouter>
                </div>
            </DappKitContainer>
        </ThemeProvider>
    );
}

function DappKitContainer({ children }: { children: React.ReactNode }) {
    const { resolvedTheme: theme } = useTheme()

    return (
        <DAppKitProvider
            nodeUrl={NODE_URL}
            genesis={NETWORK}
            usePersistence
            walletConnectOptions={walletConnectOptions}
            themeMode={theme === 'dark' ? 'DARK' : 'LIGHT'}
        >
            {children}
        </DAppKitProvider>

    )
}