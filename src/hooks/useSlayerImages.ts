import { useState, useEffect } from "react";

const METADATA_URL =
  "https://4wz7nuijhm67qgxnqw54egbv52zocgq3qei3gbb7la5vuvowh47q.arweave.net/5bP20Qk7Pfga7YW7whg17rLhGhuBEbMEP1g7WlXWPz8/";

export const useSlayerImage = (tokenId: number) => {
  const [slayerImage, setSlayerImage] = useState<string>();
  const [imageLoading, setImageLoading] = useState<boolean>(false);

  useEffect(() => {
    setImageLoading(true);
    const fetchImage = async () => {
      try {
        const response = await fetch(`${METADATA_URL}${tokenId}.jpg`);

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
