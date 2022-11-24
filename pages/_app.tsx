import "../styles/globals.css";
import type { AppProps } from "next/app";
import {
  LivepeerConfig,
  createReactClient,
  studioProvider,
} from "@livepeer/react";
import {
  AptosWalletAdapter,
  WalletProvider,
} from "@manahippo/aptos-wallet-adapter";

const client = createReactClient({
  provider: studioProvider({ apiKey: process.env.NEXT_PUBLIC_STUDIO_API_KEY }),
});

const wallets = [new AptosWalletAdapter()];

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WalletProvider wallets={wallets} autoConnect={true}>
      <LivepeerConfig client={client}>
        <Component {...pageProps} />
      </LivepeerConfig>
    </WalletProvider>
  );
}
