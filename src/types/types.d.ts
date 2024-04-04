export type NftListType = {
  tokenId: string;
  owner: string;
  metadataUri: string;
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
