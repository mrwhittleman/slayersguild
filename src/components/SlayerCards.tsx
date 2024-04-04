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
import { NftListType } from "@/types/types";

import metadata from "@/data/metadata.json";

const findMetadata = (tokenId: number) => {
  const foundMetadata = metadata.find((meta) => meta.tokenId === tokenId);

  if (!foundMetadata) {
    throw new Error(`No metadata found for token ID ${tokenId}`);
  }

  return foundMetadata;
};

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
  loading,
  history,
}: {
  slayer: NftListType;
  className?: any;
  loading?: boolean;
  history?: { limit: string; cursor?: string };
}) {
  console.log("SLAYERCARD: ", history);
  const navigate = useNavigate();
  const slayerMetadata = findMetadata(Number(slayer.tokenId));

  // Handle the click event for the card and redirect to the slayer details page
  const handleClick = () => {
    navigate(`/slayer-details/${slayer.tokenId}`, {
      state: { slayer, slayerMetadata, ...history },
    });
  };

  // Find the attribute by the trait type
  const findAttribute = (trait_type: string) => {
    return slayerMetadata?.attributes.find(
      (attribute) => attribute.trait_type === trait_type
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
        {!loading && slayerMetadata ? (
          <img
            src={`https://nfts.vechainstats.com/xnode_slayers/${slayerMetadata.tokenId}.webp`}
            alt={slayerMetadata.name}
            width={500}
            className="flex w-[640px] max-h-sm"
          />
        ) : (
          <div className="flex w-full h-[230px] justify-center items-center bg-white/15">
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
        <div className="flex w-full h-[70px] justify-center items-center">
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
        <div className="flex w-full h-[95px] justify-center items-center">
          <Spinner />
        </div>
      )}
    </SlayerCard>
  );
}

export function SlayerCardDetails({
  slayer,
  className,
  loading,
}: {
  slayer: NftListType;
  className?: any;
  loading?: boolean;
}) {
  const navigate = useNavigate();
  const slayerMetadata = findMetadata(Number(slayer.tokenId));

  // Find the attribute by the trait type
  const findAttribute = (trait_type: string) => {
    return slayerMetadata?.attributes.find(
      (attribute) => attribute.trait_type === trait_type
    );
  };

  return (
    <SlayerCard
      // Handle the click event for the card only if the parent component has the link prop
      className={cn("max-w-xl", className)}
      key={slayer.tokenId}
    >
      <SlayerCardImage>
        {!loading && slayerMetadata ? (
          <img
            src={`https://nfts.vechainstats.com/xnode_slayers/${slayerMetadata.tokenId}.webp`}
            alt={slayerMetadata.name}
            width={500}
            className="flex w-[500px] max-h-sm"
          />
        ) : (
          <div className="flex w-full h-[230px] justify-center items-center bg-white/15">
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
        <div className="flex w-full h-[70px] justify-center items-center">
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
        <div className="flex w-full h-[95px] justify-center items-center">
          <Spinner />
        </div>
      )}
    </SlayerCard>
  );
}
