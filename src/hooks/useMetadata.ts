// useMetadata.ts
import { useState, useEffect } from "react";
import { NftMetadataType } from "@/types/types";

export const useMetadata = (tokenId: number) => {
  const [metadata, setMetadata] = useState<NftMetadataType>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetadata = async () => {
      const response = await fetch(
        `https://u3r3iwywduc6bsvgopanuu5ns7x3tetf6uua77ng6zft2cy6pabq.arweave.net/puO0WxYdBeDKpnPA2lOtl--5kmX1KA_9pvZLPQseeAM/${tokenId}.json`
      );

      if (!response.ok) {
        throw new Error(`No metadata found for token ID ${tokenId}`);
      }

      const metadata = await response.json();
      setMetadata(metadata);
      setLoading(false);
    };

    fetchMetadata();
  }, [tokenId]);

  return { metadata, loading };
};
