export type NftListType = {
  tokenId: string;
  owner: string | undefined;
};

export type NftMetadataType = {
  name: string;
  tokenId: number;
  rank: number;
  description: string;
  image: string;
  attributes: { trait_type: string; value: string | number }[];
};

export type NftAttributeType = { trait_type: string; value: string | number };

export type NftHistoryType = {
  token?: string;
  from: string;
  to?: string;
  event: string;
  timestamp: string;
  txId: string;
  marketplace?: string;
  value?: string;
};

export type NftTransferType = {
  totalItems: number;
  totalPages: number;
  page: Array<{
    txID: string;
    transfers: Array<{
      contract: string;
      from: string;
      to: string;
      tokenId: string;
      amount: string;
    }>;
  }>;
};

export type StakedNftType = {
  contract: string;
  from: string;
  to: string;
  tokenId: string;
  amount?: string;
};
