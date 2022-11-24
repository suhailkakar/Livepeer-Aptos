import React, { useEffect, useState } from "react";
import { Nav, Page } from "../../components";
import { Player } from "@livepeer/react";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import { useRouter } from "next/router";
import axios from "axios";
import { Stream } from "../../types/index";
import ReactLoading from "react-loading";

export default function Create() {
  const { wallets, connect, account } = useWallet();
  const [balance, setBalance] = useState(0);
  const [stream, setStream] = useState<Stream>();
  const [canWatch, setCanWatch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [jwt, setJwt] = useState("");
  const router = useRouter();
  const { id } = router.query;

  const checkBalance = async () => {
    console.log("checking balance", account);
    if (account?.address) {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_APTOS_DEVNET_URL}/accounts/${account?.address}/resource/${process.env.NEXT_PUBLIC_APTOS_TOKEN}`
      );
      setBalance(res.data.data.coin.value / 100000000);
      console.log("balance", res.data.data.coin.value / 100000000);
      getStream(res.data.data.coin.value / 100000000);
    }
  };

  const createJwt = async () => {
    const body = {
      playbackId: id,
      secret: account?.address,
    };
    const { data } = await axios.post("/api/jwt/create", body);

    setJwt(data.token);
    setCanWatch(true);
    setIsLoading(false);
  };

  const getStream = async (balance: number) => {
    const { data } = await axios.post<Stream>("/api/stream/get?id=" + id);

    setStream(data);
    console.log(balance);
    console.log(data?.requirements?.aptosTokenAmount);
    if (data?.requirements?.isAptosToken) {
      if (Number(balance) >= Number(data?.requirements?.aptosTokenAmount)) {
        createJwt();
      } else {
        setCanWatch(false);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    setIsLoading(true);
    if (!account) {
      connect(wallets[0].adapter.name);
    } else {
      Promise.all([checkBalance()]);
    }
  }, [account?.address]);

  return (
    <Page>
      <Nav account={account} />
      {isLoading ? (
        <div className="flex flex-col mt-60 justify-center items-center">
          <ReactLoading type="spinningBubbles" color="#0DF6F7" width={80} />
          <p className="mt-12 text-zinc-400">Authenticating, please wait.</p>
        </div>
      ) : (
        <div className="flex flex-col mt-40 justify-center items-center">
          {canWatch ? (
            <div className="w-1/2">
              <Player
                title={stream?.streamName}
                showPipButton
                jwt={jwt}
                playbackId={stream?.playbackId}
              />
            </div>
          ) : (
            <>
              <p className="text-zinc-400">
                Oops, you need to have minimum{" "}
                <span className="text-primary">
                  {stream?.requirements.aptosTokenAmount} APTOS{" "}
                </span>
                to watch this stream.
              </p>
            </>
          )}
        </div>
      )}
    </Page>
  );
}
