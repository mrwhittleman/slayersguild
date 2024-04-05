import React from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import earthIcon from "@/assets/earth_transparent.png";
import fireIcon from "@/assets/fire_transparent.png";
import waterIcon from "@/assets/water_transparent.png";
import {
  SlayerCard,
  SlayerCardImage,
  SlayerCardHud,
  SlayerCardContent,
} from "@/components/ui/slayercard";
import Spinner from "@/components/Spinner";
import { NftListType, NftAttributeType, NftMetadataType } from "@/types/types";
import { useMetadata } from "@/hooks/useMetadata";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faCircle as faFullCircle,
  faHandBackFist,
  faHeartPulse,
  faMagnifyingGlass,
  faShield,
} from "@fortawesome/free-solid-svg-icons";
import { faCircle } from "@fortawesome/free-regular-svg-icons";
import ImageViewer from "./ImageViewer";

// Base URL for the metadata of each slayer TO BE PUT IN .ENV FILE!!!
const METADATA_URL =
  "https://4wz7nuijhm67qgxnqw54egbv52zocgq3qei3gbb7la5vuvowh47q.arweave.net/5bP20Qk7Pfga7YW7whg17rLhGhuBEbMEP1g7WlXWPz8/";

// Create the Slayer HUD for each stat line and elemental class
const slayerStatsHud = (slayerMetadata: NftMetadataType) => {
  // Find the attribute by the trait type
  const findAttribute = (trait_type: string) => {
    return slayerMetadata?.attributes.find(
      (attribute: NftAttributeType) => attribute.trait_type === trait_type
    );
  };
  /* filling up the bar for the requested skill line either will filled or blank skill points */
  const skillPointHud = (skill: number) => {
    return [
      ...Array(skill)
        .fill(0)
        .map((_, idx) => (
          <FontAwesomeIcon key={`full${idx}`} icon={faFullCircle} size="xs" />
        )),
      ...Array(5 - skill)
        .fill(0)
        .map((_, idx) => (
          <FontAwesomeIcon
            key={`empty${idx}`}
            icon={faCircle as IconProp}
            size="xs"
          />
        )),
    ];
  };
  /* Check for the elemental class and return the icon */
  const elementalClass = (elemental: string) => {
    return elemental === "Earth" ? (
      <img className="" src={earthIcon} alt="Earth Icon" width={40} />
    ) : elemental === "Fire" ? (
      <img className="" src={fireIcon} alt="Fire Icon" width={40} />
    ) : elemental === "Water" ? (
      <img className="" src={waterIcon} alt="Water Icon" width={40} />
    ) : (
      <></>
    );
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        {slayerMetadata?.attributes.map((attribute, idx) => {
          if (["Attack", "Defense", "Health"].includes(attribute.trait_type)) {
            return (
              <div
                key={attribute.trait_type + idx}
                className="flex gap-2 lg:gap-4 items-center h-4"
              >
                {attribute.trait_type === "Attack" && (
                  <FontAwesomeIcon icon={faHandBackFist} className="w-4" />
                )}
                {attribute.trait_type === "Defense" && (
                  <FontAwesomeIcon icon={faShield} className="w-4" />
                )}
                {attribute.trait_type === "Health" && (
                  <FontAwesomeIcon icon={faHeartPulse} className="w-4" />
                )}
                <div className="flex gap-1">
                  {skillPointHud(Number(attribute.value))}
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>
      {/* Handle the elemental sign */}
      <div className="flex w-fit">
        {slayerMetadata &&
          elementalClass(findAttribute("Elemental")?.value as string)}
      </div>
    </>
  );
};

// Handle the click event for the card and redirect to the slayer details page
const handleClick = (
  navigate: Function,
  slayer: NftListType,
  slayerMetadata: NftMetadataType,
  getCursor: Function,
  limit: string
) => {
  const cursor = getCursor();
  navigate(`/slayer-details/${slayer.tokenId}`, {
    state: { slayer, slayerMetadata, limit, cursor },
  });
};

export default function SlayerCardComponent({
  slayer,
  className,
  history,
  type,
}: {
  slayer: NftListType;
  className?: string;
  history?: { limit: string; getCursor: Function };
  type?: string;
}) {
  // Set the cursor, limit, and navigate function only for the gallery view
  let limit: string;
  let navigate: Function;
  let getCursor: Function;
  if (type === "gallery" && history) {
    limit = history.limit;
    getCursor = history.getCursor;
    navigate = useNavigate();
  }

  const { metadata: slayerMetadata, loading } = useMetadata(
    Number(slayer.tokenId)
  );
  return (
    <SlayerCard
      // Handle the click event for the card only if the parent component has the link prop
      className={cn("max-w-xl", className)}
      onClick={
        type === "gallery"
          ? () =>
              slayerMetadata &&
              handleClick(navigate, slayer, slayerMetadata, getCursor, limit)
          : undefined
      }
    >
      <SlayerCardImage>
        {!loading && METADATA_URL && slayerMetadata ? (
          <>
            <div className="relative flex">
              <img
                src={METADATA_URL + slayerMetadata.tokenId + ".jpg"}
                alt={slayerMetadata.name}
                width={640}
                className="flex w-[640px] max-h-sm"
              />
              {type !== "gallery" && (
                <>
                  <ImageViewer
                    imageUrl={METADATA_URL + slayerMetadata.tokenId + ".jpg"}
                    altName={slayerMetadata.name}
                  >
                    <FontAwesomeIcon
                      icon={faMagnifyingGlass}
                      size="xl"
                      className="absolute bottom-4 right-4 bg-tertiary/25 rounded-lg p-2 hover:bg-tertiary/45 hover:scale-110 transition-all"
                    />
                  </ImageViewer>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="flex w-full h-[260px] justify-center items-center bg-white/15">
            <Spinner />
          </div>
        )}
      </SlayerCardImage>
      {/* Name and Rank */}
      {!loading ? (
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
      {!loading ? (
        <SlayerCardHud className="flex items-center justify-between">
          {slayerMetadata && slayerStatsHud(slayerMetadata)}
        </SlayerCardHud>
      ) : (
        <div className="flex w-full h-[80px] justify-center items-center">
          <Spinner />
        </div>
      )}
    </SlayerCard>
  );
}

{
  /* 
          <img
            src={METADATA_URL + slayerMetadata.tokenId + ".jpg"}
            alt={slayerMetadata.name}
            width={500}
            className="flex w-[500px] max-h-sm"
          />
          
          <div className="flex w-[500px] h-[500px] justify-center items-center bg-white/15">
            <Spinner />
          </div>

        <div className="flex w-[500px] h-[65px] justify-center items-center">
          <Spinner />
        </div>

        <div className="flex w-full h-[80px] justify-center items-center">
          <Spinner />
        </div> */
}
