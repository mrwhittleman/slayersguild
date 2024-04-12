// useMetadata.ts
import { useState, useEffect } from "react";
import { NftMetadataType } from "@/types/types";
import { METADATA_URL } from "@/config";

export const useMetadata = (tokenId: number) => {
  const [metadata, setMetadata] = useState<NftMetadataType>();
  const [metadataLoading, setMetadataLoading] = useState<boolean>(false);

  useEffect(() => {
    setMetadataLoading(true);
    const fetchMetadata = async () => {
      try {
        const response = await fetch(`${METADATA_URL}${tokenId}.json`);

        if (!response.ok) {
          throw new Error(`No metadata found for token ID ${tokenId}`);
        }

        const metadata = await response.json();
        setMetadata(metadata);
      } catch (error) {
        console.error(error);
      } finally {
        setMetadataLoading(false);
      }
    };

    fetchMetadata();
  }, [tokenId]);
  return { metadata, metadataLoading };
};
