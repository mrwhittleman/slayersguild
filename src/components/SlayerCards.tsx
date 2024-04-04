import React from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import attackIcon from "@/assets/attack.png";
import defenseIcon from "@/assets/defense.png";
import healthIcon from "@/assets/health.png";
import pipBlank from "@/assets/pip-blank.png";
import pipFull from "@/assets/pip-filled.png";
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
import { NftListType, NftAttributeType } from "@/types/types";
import { useMetadata } from "@/hooks/useMetadata";

// Base URL for the metadata of each slayer TO BE PUT IN .ENV FILE!!!
const METADATA_URL =
  "https://4wz7nuijhm67qgxnqw54egbv52zocgq3qei3gbb7la5vuvowh47q.arweave.net/5bP20Qk7Pfga7YW7whg17rLhGhuBEbMEP1g7WlXWPz8/";

/* filling up the bar for the requested skill line either will filled or blank skill points */
const skillPointHud = (skill: number) => {
  return [
    ...Array(skill)
      .fill(0)
      .map((_, i) => (
        <img
          key={i}
          src={pipFull}
          alt="Pip Full"
          width={16}
          className="py-1.5"
        />
      )),
    ...Array(5 - skill)
      .fill(0)
      .map((_, i) => (
        <img
          key={i + skill}
          src={pipBlank}
          alt="Pip Blank"
          width={16}
          className="py-1.5"
        />
      )),
  ];
};
/* check for the elemental class and return the correct icon */
const elementalClass = (elemental: string) => {
  return elemental === "Earth" ? (
    <img className="" src={earthIcon} alt="Earth Icon" width={64} />
  ) : elemental === "Fire" ? (
    <img className="" src={fireIcon} alt="Fire Icon" width={64} />
  ) : elemental === "Water" ? (
    <img className="" src={waterIcon} alt="Water Icon" width={64} />
  ) : (
    <></>
  );
};

export default function SlayerCardGallery({
  slayer,
  className,
  history,
}: {
  slayer: NftListType;
  className?: string;
  history?: { limit: string; cursor?: string };
}) {
  /* TO REMOVE!!! */
  /* console.log("SLAYERCARD: ", history); */
  const navigate = useNavigate();
  const { metadata: slayerMetadata, loading } = useMetadata(
    Number(slayer.tokenId)
  );

  // Handle the click event for the card and redirect to the slayer details page
  const handleClick = () => {
    navigate(`/slayer-details/${slayer.tokenId}`, {
      state: { slayer, slayerMetadata, ...history },
    });
  };

  // Find the attribute by the trait type
  const findAttribute = (trait_type: string) => {
    return slayerMetadata?.attributes.find(
      (attribute: NftAttributeType) => attribute.trait_type === trait_type
    );
  };

  return (
    <SlayerCard
      // Handle the click event for the card only if the parent component has the link prop
      className={cn("max-w-xl cursor-pointer", className)}
      key={slayer.tokenId}
      onClick={handleClick}
    >
      <SlayerCardImage>
        {!loading && METADATA_URL && slayerMetadata ? (
          <img
            src={METADATA_URL + slayerMetadata.tokenId + ".jpg"}
            alt={slayerMetadata.name}
            width={640}
            className="flex w-[640px] max-h-sm"
          />
        ) : (
          <div className="flex w-full h-[260px] justify-center items-center bg-white/15">
            <Spinner />
          </div>
        )}
      </SlayerCardImage>
      {!loading ? (
        <SlayerCardContent className="border-b">
          <h2 className="text-lg font-normal">{slayerMetadata?.name}</h2>
          <p className="text-muted-foreground text-sm">
            Rank: {slayerMetadata?.rank}
          </p>
        </SlayerCardContent>
      ) : (
        <div className="flex w-full h-[65px] justify-center items-center">
          <Spinner />
        </div>
      )}
      {/* Handle the Stats HUD for each skill bar */}
      {!loading ? (
        <SlayerCardHud className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex gap-2 lg:gap-4 items-center">
              <img src={attackIcon} alt="Attack Icon" width={16} />
              <div className="flex gap-0 md:gap-1">
                {slayerMetadata &&
                  skillPointHud(Number(findAttribute("Attack")?.value))}
              </div>
            </div>
            <div className="flex gap-2 lg:gap-4 items-center">
              <img src={defenseIcon} alt="Defense Icon" width={16} />
              <div className="flex gap-0 md:gap-1">
                {slayerMetadata &&
                  skillPointHud(Number(findAttribute("Defense")?.value))}
              </div>
            </div>
            <div className="flex gap-2 lg:gap-4 items-center">
              <img src={healthIcon} alt="Health Icon" width={16} />
              <div className="flex gap-0 md:gap-1">
                {slayerMetadata &&
                  skillPointHud(Number(findAttribute("Health")?.value))}
              </div>
            </div>
          </div>
          {/* Handle the elemental sign */}
          <div className="flex w-12 ">
            {slayerMetadata &&
              elementalClass(findAttribute("Elemental")?.value as string)}
          </div>
        </SlayerCardHud>
      ) : (
        <div className="flex w-full h-[80px] justify-center items-center">
          <Spinner />
        </div>
      )}
    </SlayerCard>
  );
}

export function SlayerCardDetails({
  slayer,
  className,
}: {
  slayer: NftListType;
  className?: string;
}) {
  const { metadata: slayerMetadata, loading } = useMetadata(
    Number(slayer.tokenId)
  );

  // Find the attribute by the trait type
  const findAttribute = (trait_type: string) => {
    return slayerMetadata?.attributes.find(
      (attribute: NftAttributeType) => attribute.trait_type === trait_type
    );
  };

  return (
    <SlayerCard
      // Handle the click event for the card only if the parent component has the link prop
      className={cn("max-w-xl", className)}
      key={slayer.tokenId}
    >
      <SlayerCardImage>
        {!loading && METADATA_URL && slayerMetadata ? (
          <img
            src={METADATA_URL + slayerMetadata.tokenId + ".jpg"}
            alt={slayerMetadata.name}
            width={500}
            className="flex w-[500px] max-h-sm"
          />
        ) : (
          <div className="flex w-[500px] h-[500px] justify-center items-center bg-white/15">
            <Spinner />
          </div>
        )}
      </SlayerCardImage>
      {!loading ? (
        <SlayerCardContent className="border-b">
          <h2 className="text-xl font-normal">{slayerMetadata?.name}</h2>
          <p className="text-muted-foreground text-sm">
            Rank: {slayerMetadata?.rank}
          </p>
        </SlayerCardContent>
      ) : (
        <div className="flex w-[500px] h-[65px] justify-center items-center">
          <Spinner />
        </div>
      )}
      {/* Handle the Stats HUD for each skill bar */}
      {!loading ? (
        <SlayerCardHud className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex gap-4 items-center">
              <img src={attackIcon} alt="Attack Icon" width={16} />
              <div className="flex gap-1">
                {slayerMetadata &&
                  skillPointHud(Number(findAttribute("Attack")?.value))}
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <img src={defenseIcon} alt="Defense Icon" width={16} />
              <div className="flex gap-1">
                {slayerMetadata &&
                  skillPointHud(Number(findAttribute("Defense")?.value))}
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <img src={healthIcon} alt="Health Icon" width={16} />
              <div className="flex gap-1">
                {slayerMetadata &&
                  skillPointHud(Number(findAttribute("Health")?.value))}
              </div>
            </div>
          </div>
          {/* Handle the elemental sign */}
          <div className="flex w-12 ">
            {slayerMetadata &&
              elementalClass(findAttribute("Elemental")?.value as string)}
          </div>
        </SlayerCardHud>
      ) : (
        <div className="flex w-full h-[80px] justify-center items-center">
          <Spinner />
        </div>
      )}
    </SlayerCard>
  );
}
