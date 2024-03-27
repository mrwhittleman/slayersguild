import React from "react";
import { useConnex } from "@vechain/dapp-kit-react";
import { SLAYER_CONTRACT } from "@/config";

type Token = {
  tokenId: string;
  tokenURI: string;
};

export function useNftList(address: string | null) {
  const connex = useConnex();
  const [isLoading, setIsLoading] = React.useState(false);
  const [tokens, setTokens] = React.useState<Token[]>([]);
  const [balance, setBalance] = React.useState(0);

  const updateTokens = async (address: string) => {
    setIsLoading(true);
    try {
      const { tokens, balance } = await getTokensFor(address);
      setTokens(tokens);
      setBalance(balance);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  React.useEffect(() => {
    if (!address) return;
    updateTokens(address);
  }, [connex, address]);

  return { isLoading, tokens, balance };

  async function getTokensFor(
    address: string
  ): Promise<{ tokens: Token[]; balance: number }> {
    const getBalanceOf = connex.thor
      .account(SLAYER_CONTRACT)
      .method(ABI.balanceOf)
      .cache([]);
    const getTokenOfOwnerByIndex = connex.thor
      .account(SLAYER_CONTRACT)
      .method(ABI.tokenOfOwnerByIndex)
      .cache([]);
    const getTokenURI = connex.thor
      .account(SLAYER_CONTRACT)
      .method(ABI.tokenURI)
      .cache([]);
    const {
      decoded: { balance },
    } = await getBalanceOf.call(address);
    const tokens: Token[] = [];
    for (let index = 0; index < balance; index++) {
      const {
        decoded: { tokenId },
      } = await getTokenOfOwnerByIndex.call(address, index);
      const {
        decoded: { tokenURI },
      } = await getTokenURI.call(tokenId);
      tokens.push({ tokenId, tokenURI });
    }

    return { tokens, balance };
  }
}

const ABI = {
  balanceOf: {
    inputs: [{ internalType: "address", name: "addr", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "balance", type: "uint256" }],
    type: "function",
  },
  tokenOfOwnerByIndex: {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "uint256", name: "index", type: "uint256" },
    ],
    name: "tokenOfOwnerByIndex",
    outputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    type: "function",
  },
  tokenURI: {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ internalType: "string", name: "tokenURI", type: "string" }],
    type: "function",
  },
};
