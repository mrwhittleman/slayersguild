import React from "react";
import { useNavigate, NavigateFunction, Link } from "react-router-dom";
import { useWallet } from "@vechain/dapp-kit-react";
import { useSlayerImage } from "@/hooks/useSlayerImages";
import { useMetadata } from "@/hooks/useMetadata";
import { cn } from "@/lib/utils";
import { SLAYER_CONTRACT, SLAYER_IMAGE_URL, WOV_URL } from "@/config";
import { NftListType } from "@/types/types";
import {
  SlayerCard,
  SlayerCardImage,
  SlayerCardHud,
  SlayerCardContent,
} from "@/components/ui/slayercard";
import ImageViewer from "@/components/ImageViewer";
import Spinner from "@/components/Spinner";
import SlayerHud from "@/components/SlayerHud";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

// Create the Slayer HUD for each stat line and elemental class

// Handle the click event for the card and redirect to the slayer details page
const handleClick = (
  navigate: NavigateFunction,
  slayer: NftListType,
  staked?: boolean
) => {
  navigate(`/slayer-details/${slayer.tokenId}`, {
    state: { slayer, staked },
  });
};

export default function SlayerCardComponent({
  slayer,
  className,
  type,
  staked,
}: {
  slayer: NftListType;
  className?: string;
  type?: "link" | "dummy";
  staked?: boolean;
}) {
  // Set the cursor, limit, and navigate function only for the gallery view
  const navigate = useNavigate();
  const wallet = useWallet();

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
        type === "link"
          ? () => handleClick(navigate, slayer, staked)
          : undefined
      }
    >
      <SlayerCardImage>
        {!imageLoading && !metadataLoading ? (
          slayerImage &&
          slayerMetadata && (
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
          )
        ) : (
          <div className="flex w-[640] h-[260px] justify-center items-center bg-white/15">
            <Spinner />
          </div>
        )}
      </SlayerCardImage>
      {/* Name and Rank */}
      {!metadataLoading ? (
        <SlayerCardContent className="flex flex-row justify-between border-b">
          <div className="flex flex-col">
            <h2 className="text-lg font-normal">{slayerMetadata?.name}</h2>
            <p className="text-muted-foreground text-xs">
              Rank: {slayerMetadata?.rank}
            </p>
          </div>
          {slayer.owner &&
            slayer.owner !== wallet.account &&
            type !== "link" &&
            type !== "dummy" && (
              <Link
                to={`${WOV_URL}/token/${SLAYER_CONTRACT}/${slayer.tokenId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center mr-4 hover:text-tertiary hover:scale-110 transition-all"
              >
                <FontAwesomeIcon icon={faShoppingCart} size="xl" />
              </Link>
            )}
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
