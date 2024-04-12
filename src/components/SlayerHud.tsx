import React from "react";
import { NftAttributeType, NftMetadataType } from "@/types/types";
import earthIcon from "@/assets/earth_transparent.png";
import fireIcon from "@/assets/fire_transparent.png";
import waterIcon from "@/assets/water_transparent.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faCircle as faFullCircle,
  faHandBackFist,
  faHeartPulse,
  faShield,
} from "@fortawesome/free-solid-svg-icons";
import { faCircle } from "@fortawesome/free-regular-svg-icons";

const slayerStatsHud = ({
  slayerMetadata,
}: {
  slayerMetadata: NftMetadataType;
}) => {
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
          <FontAwesomeIcon key={`full${idx}`} icon={faFullCircle} size="2xs" />
        )),
      ...Array(5 - skill)
        .fill(0)
        .map((_, idx) => (
          <FontAwesomeIcon
            key={`empty${idx}`}
            icon={faCircle as IconProp}
            size="2xs"
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

const SlayerHud = ({ slayerMetadata }: { slayerMetadata: NftMetadataType }) => {
  return <>{slayerMetadata && slayerStatsHud({ slayerMetadata })}</>;
};

export default SlayerHud;
