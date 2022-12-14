import React, { useEffect, useState } from "react";
import { Nav, Page } from "../../components";
import { Player } from "@livepeer/react";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import { useRouter } from "next/router";
import axios from "axios";
import { Stream } from "../../types/index";
import ReactLoading from "react-loading";
import ConnectWallet from "../../components/ConnectWallet";

export default function Create() {
  const { wallets, connect, account } = useWallet();
  const [stream, setStream] = useState<Stream>();
  const [canWatch, setCanWatch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [jwt, setJwt] = useState("");
  const router = useRouter();
  const { id } = router.query;

  const checkBalance = async () => {
    if (account?.address) {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_APTOS_DEVNET_URL}/accounts/${account?.address}/resource/${process.env.NEXT_PUBLIC_APTOS_TOKEN}`
      );
      getStream(res.data.data.coin.value / 100000000);
    }
  };

  const createJwt = async () => {
    const body = {
      playbackId: id,
      secret: account?.address,
    };
    console.log(body);
    const { data } = await axios.post("/api/jwt/create", body);
    console.log(data);
    setJwt(data.token);
    play(true);
  };

  const checkAssets = (address: string | null) => {
    return axios
      .get(
        `${process.env.NEXT_PUBLIC_TOPAZ_API}/profile-data?owner=${account?.address}`
      )
      .then(({ data }) => {
        const assets = data?.data;
        if (assets.length > 0) {
          const asset = assets.find((asset: any) =>
            asset.collection_id.includes(address)
          );
          if (asset) {
            return true;
          }
        } else {
          return false;
        }
      });
  };

  const getStream = async (balance: number) => {
    const { data } = await axios.post<Stream>("/api/stream/get?id=" + id);
    const hasAsset = await checkAssets(data.requirements.assetAddress);
    setStream(data);
    if (
      data?.requirements?.isAptosToken &&
      data?.requirements?.isAssetAddress
    ) {
      if (
        Number(balance) >= Number(data?.requirements?.aptosTokenAmount) &&
        hasAsset
      ) {
        createJwt();
      } else {
        play(false);
      }

      return;
    }
    if (data?.requirements?.isAptosToken) {
      if (Number(balance) >= Number(data?.requirements?.aptosTokenAmount)) {
        createJwt();
      } else {
        play(false);
      }
      return;
    }

    if (data?.requirements?.isAssetAddress) {
      if (hasAsset) {
        createJwt();
      } else {
        play(false);
      }
      return;
    }
  };

  const play = (canPlay: boolean) => {
    if (canPlay) {
      setCanWatch(true);
      setIsLoading(false);
    } else {
      setCanWatch(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    console.log(account);
    if (account?.address) {
      checkBalance();
    }
  }, [account?.address]);

  return (
    <Page>
      <Nav account={account} />
      {!account?.address ? (
        <>
          <ConnectWallet />
        </>
      ) : (
        <>
          {isLoading ? (
            <div className="flex flex-col mt-60 justify-center items-center">
              <ReactLoading type="spinningBubbles" color="#0DF6F7" width={80} />
              <p className="mt-12 text-zinc-400">
                Authenticating, please wait.
              </p>
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
                  <p className="text-zinc-400 max-w-[70%] text-center">
                    Oops, you need to have minimum{" "}
                    <span className="text-primary">
                      {stream?.requirements.isAptosToken &&
                        stream?.requirements.aptosTokenAmount + " APTOS token "}
                      {stream?.requirements?.isAptosToken &&
                        stream?.requirements?.isAssetAddress &&
                        "and"}{" "}
                      {stream?.requirements.isAssetAddress &&
                        stream?.requirements.assetAddress + " Asset "}
                    </span>
                    to watch this stream.
                  </p>
                </>
              )}
            </div>
          )}
        </>
      )}
    </Page>
  );
}
