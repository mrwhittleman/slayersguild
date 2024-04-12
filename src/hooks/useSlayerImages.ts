import { useState, useEffect } from "react";
import { SLAYER_IMAGE_URL } from "@/config";

export const useSlayerImage = (tokenId: number) => {
  const [slayerImage, setSlayerImage] = useState<string>();
  const [imageLoading, setImageLoading] = useState<boolean>(false);

  useEffect(() => {
    setImageLoading(true);
    const fetchImage = async () => {
      try {
        const response = await fetch(`${SLAYER_IMAGE_URL}${tokenId}.jpg`);

        if (!response.ok) {
          throw new Error(`No image found for token ID ${tokenId}`);
        }

        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setSlayerImage(imageUrl);
      } catch (error) {
        console.error(error);
      } finally {
        setImageLoading(false);
      }
    };

    fetchImage();
  }, [tokenId]);
  return { slayerImage, imageLoading };
};
