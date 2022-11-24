import { AccountKeys } from "@manahippo/aptos-wallet-adapter";

type StreamRequirements = {
  assetAddress: string | null;
  isAssetAddress: boolean;
  aptosTokenAmount: string | null;
  isAptosToken: boolean;
};

export type CreateSignedPlaybackResponse = {
  acknowledged: boolean;
  insertedId: string;
};

export type Stream = {
  playbackId: string | undefined;
  streamId: string | undefined;
  streamName: string | undefined;
  requirements: StreamRequirements;
  author: AccountKeys | null;
  createdAt: Date | undefined;
};
