import React from "react";
import { useNavigate, NavigateFunction } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useSlayerImage } from "@/hooks/useSlayerImages";
import { useMetadata } from "@/hooks/useMetadata";
import {
  SlayerCard,
  SlayerCardImage,
  SlayerCardHud,
  SlayerCardContent,
} from "@/components/ui/slayercard";
import ImageViewer from "./ImageViewer";
import Spinner from "@/components/Spinner";
import SlayerHud from "./SlayerHud";
import { NftListType } from "@/types/types";
import { SLAYER_IMAGE_URL } from "@/config";

// Create the Slayer HUD for each stat line and elemental class

// Handle the click event for the card and redirect to the slayer details page
const handleClick = (navigate: NavigateFunction, slayer: NftListType) => {
  navigate(`/slayer-details/${slayer.tokenId}`, {
    state: { slayer },
  });
};

export default function SlayerCardComponent({
  slayer,
  className,
  type,
}: {
  slayer: NftListType;
  className?: string;
  type?: "link" | "dummy" | null;
}) {
  // Set the cursor, limit, and navigate function only for the gallery view
  const navigate = useNavigate();

  const { metadata: slayerMetadata, metadataLoading } = useMetadata(
    Number(slayer.tokenId)
  );

  const { slayerImage: slayerImage, imageLoading } = useSlayerImage(
    Number(slayer.tokenId)
  );

  return (
    <SlayerCard
      // Handle the click event for the card only if the parent component has the link prop
      className={cn("w-full max-w-xl h-fit", className)}
      onClick={
        type === "link" && slayerMetadata
          ? () => slayerMetadata && handleClick(navigate, slayer)
          : undefined
      }
    >
      <SlayerCardImage>
        {!imageLoading && slayerImage && slayerMetadata ? (
          <>
            <div className="relative flex w-full">
              <img
                src={slayerImage}
                alt={slayerMetadata.name}
                width={640}
                height={640}
              />
              {type !== "link" && type !== "dummy" && (
                <>
                  <ImageViewer
                    imageUrl={
                      SLAYER_IMAGE_URL + slayerMetadata.tokenId + ".jpg"
                    }
                    altName={slayerMetadata.name}
                  />
                </>
              )}
            </div>
          </>
        ) : (
          <div className="flex w-[640] h-[260px] justify-center items-center bg-white/15">
            <Spinner />
          </div>
        )}
      </SlayerCardImage>
      {/* Name and Rank */}
      {!metadataLoading ? (
        <SlayerCardContent className="border-b">
          <h2 className="text-lg font-normal">{slayerMetadata?.name}</h2>
          <p className="text-muted-foreground text-xs">
            Rank: {slayerMetadata?.rank}
          </p>
        </SlayerCardContent>
      ) : (
        <div className="flex w-full h-[65px] justify-center items-center">
          <Spinner />
        </div>
      )}
      {/* Handle the Stats HUD for each skill bar and elemental class */}
      {!metadataLoading ? (
        slayerMetadata && (
          <SlayerCardHud className="flex items-center justify-between">
            <SlayerHud slayerMetadata={slayerMetadata} />
          </SlayerCardHud>
        )
      ) : (
        <div className="flex w-full h-[80px] justify-center items-center">
          <Spinner />
        </div>
      )}
    </SlayerCard>
  );
}
