import "../styles/globals.css";
import type { AppProps } from "next/app";
import {
  LivepeerConfig,
  createReactClient,
  studioProvider,
} from "@livepeer/react";
import {
  FewchaWalletAdapter,
  PontemWalletAdapter,
  MartianWalletAdapter,
  WalletProvider,
  AptosWalletAdapter,
} from "@manahippo/aptos-wallet-adapter";
import { Toaster } from "react-hot-toast";
import { useMemo } from "react";

const client = createReactClient({
  provider: studioProvider({ apiKey: process.env.NEXT_PUBLIC_STUDIO_API_KEY }),
});

const wallets = [
  new AptosWalletAdapter(),
  new MartianWalletAdapter(),
  new PontemWalletAdapter(),
  new FewchaWalletAdapter(),
];

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WalletProvider wallets={wallets} autoConnect={true}>
      <LivepeerConfig client={client}>
        <Component {...pageProps} />
        <Toaster />
      </LivepeerConfig>
    </WalletProvider>
  );
}
