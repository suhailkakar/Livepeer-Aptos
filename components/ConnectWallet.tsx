import { useWallet, Wallet } from "@manahippo/aptos-wallet-adapter";
import React from "react";
import { Button, Input } from "./index";

export default function ConnectWallet({}: {}) {
  const { wallets, connect, account } = useWallet();

  const connectWallet = async (wallet: Wallet) => {
    connect(wallet.adapter.name);
    window.location.reload();
  };

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none ">
        <div className="relative my-6 md:w-9/12  w-10/12 lg:w-1/3">
          <div className=" rounded-lg   border-zinc-800 shadow-lg relative flex flex-col w-full outline-none focus:outline-none">
            <div className="relative p-8   flex-auto ">
              <h2 className="text-white font-sans text-xl mb-4 font-medium">
                Connect your wallet
              </h2>
              {wallets.map((wallet) => (
                <div
                  onClick={() => connectWallet(wallet)}
                  className="p-3 bg-[#151718] border border-zinc-800 rounded-lg shadow-sm mt-4 flex flex-row hover:cursor-pointer"
                >
                  <img
                    src={wallet.adapter.icon}
                    className="w-6 h-6 rounded-md mr-4"
                  />
                  <p className="text-zinc-500 font-medium">
                    {wallet.adapter.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
