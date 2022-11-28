import React, { useEffect, useState } from "react";
import { Page, Input, Button, Copy, Nav } from "../../components";
import { useCreateStream } from "@livepeer/react";
import { Stream, CreateSignedPlaybackResponse } from "../../types";
import axios from "axios";
import Link from "next/link";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import toast from "react-hot-toast";
import ConnectWallet from "../../components/ConnectWallet";

export default function Create() {
  const [streamName, setStreamName] = useState<string>("");
  const [assetAddress, setAssetAddress] = useState<string | null>(null);
  const [aptosTokenAmount, setAptosTokenAmount] = useState<string | null>(null);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const { wallets, connect, account } = useWallet();
  const {
    mutate: createStream,
    data: stream,
    status,
  } = useCreateStream(
    streamName
      ? {
          name: streamName,
          playbackPolicy: { type: "jwt" },
        }
      : null
  );

  const saveStream = async () => {
    const body: Stream = {
      playbackId: stream?.playbackId,
      streamId: stream?.id,
      streamName: stream?.name,
      createdAt: new Date(),
      author: account,
      requirements: {
        isAssetAddress: assetAddress ? true : false,
        isAptosToken: aptosTokenAmount ? true : false,
        assetAddress,
        aptosTokenAmount,
      },
    };
    const { data } = await axios.post<CreateSignedPlaybackResponse>(
      "/api/stream/create",
      body
    );
    if (data) {
      toast("Stream created successfully!", {
        icon: "🎉",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      const shareLink = `${window.location.origin}/watch/${stream?.playbackId}`;
      setShareLink(shareLink);
    }
  };

  const copy = () => {
    if (!shareLink) return;
    navigator.clipboard.writeText(shareLink);
    toast("Copied to clipboard!", {
      icon: "📋",
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });
  };

  return (
    <Page>
      <Nav account={account} />
      <div className="mx-12 flex justify-center flex-col items-center">
        {!account?.address ? (
          <ConnectWallet />
        ) : (
          <>
            {stream ? (
              <div className="w-1/2 mt-20">
                <h3 className="text-2xl font-medium text-white">Stream Info</h3>
                <p className="text-zinc-400 mt-4">
                  Use these details to connect to Livepeer from streaming
                  software like{" "}
                  <Link
                    href="https://docs.livepeer.studio/guides/live/stream-via-obs"
                    className="text-primary "
                  >
                    OBS
                  </Link>
                </p>
                <div className="flex flex-col mt-2">
                  <div className="flex mt-2">
                    <p className="font-regular text-zinc-500 w-32 ">
                      Stream Name:{" "}
                    </p>
                    <p className="text-white ml-2">{stream.name}</p>
                  </div>

                  <div className="flex mt-2">
                    <p className="font-regular text-zinc-500 w-32">
                      Playback Id:{" "}
                    </p>
                    <p className="text-white ml-2">{stream.playbackId}</p>
                  </div>

                  <div className="flex mt-2">
                    <p className="font-regular text-zinc-500 w-32">
                      Stream Key:{" "}
                    </p>
                    <p className="text-white ml-2">{stream.streamKey}</p>
                  </div>

                  <div className="flex mt-2">
                    <p className="font-regular text-zinc-500 w-32">
                      Ingest URL:{" "}
                    </p>
                    <p className="text-white ml-2 hover:text-primary hover:cursor-pointer">
                      {stream?.rtmpIngestUrl}
                    </p>
                  </div>
                </div>
                <h3 className="text-2xl font-medium mt-10 text-white">
                  Token Gating Requirements
                </h3>
                <div className="flex flex-row mt-4 justify-between">
                  <div className="w-[42%]">
                    <Input
                      label="Asset address"
                      placeholder="0x..."
                      onChange={(e) => setAssetAddress(e.target.value)}
                    />
                  </div>
                  <p className="text-zinc-400 mt-10">and/or</p>
                  <div className="w-[42%]">
                    <Input
                      label="Amount of Aptos token"
                      placeholder="20 Aptos"
                      onChange={(e) => setAptosTokenAmount(e.target.value)}
                    />
                  </div>
                </div>
                <Button
                  className={`bg-primary border-primary text-background px-5 py-3 mt-2 border hover:border-primary hover:text-primary hover:bg-background`}
                  text="text-md"
                  onClick={() => saveStream()}
                >
                  Save and continue
                </Button>

                <Button
                  className={`bg-zinc-700 text-white px-5 py-3 mt-2 border-none  ml-6 ${
                    !shareLink ? " cursor-not-allowed opacity-20 " : ""
                  }`}
                  text="text-md"
                  onClick={copy}
                >
                  Copy link
                  <Copy text={shareLink} />
                </Button>
              </div>
            ) : (
              <div className="w-1/3 mt-20">
                <Input
                  label="Stream Name"
                  placeholder="My first stream"
                  onChange={(e) => setStreamName(e.target.value)}
                />
                <div className="flex justify-end">
                  <Button
                    className={`bg-primary border-primary text-background px-4 py-2.5 ${
                      status === "loading" || !account || !streamName
                        ? "cursor-not-allowed opacity-20"
                        : ""
                    }`}
                    text="text-sm"
                    onClick={() => createStream?.()}
                  >
                    Create Stream
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Page>
  );
}
