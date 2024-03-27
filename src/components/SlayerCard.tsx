import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import attackIcon from "@/assets/attack.png";
import defenseIcon from "@/assets/defense.png";
import healthIcon from "@/assets/health.png";
import pipBlank from "@/assets/pip-blank.png";
import pipFull from "@/assets/pip-filled.png";
import earthIcon from "@/assets/earth_transparent.png";
import fireIcon from "@/assets/fire_transparent.png";
import waterIcon from "@/assets/water_transparent.png";

interface SlayerType {
  name: string;
  description: string;
  image: string;
  Facing: string;
  Eyes: string;
  "Eye Color": string;
  Gender: string;
  Species: string;
  Companion: string;
  Weapon: string;
  Attack: number;
  Defense: number;
  Health: number;
  Elemental: string;
}

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
const elemenatlClass = (elemental: string) => {
  return elemental === "Earth" ? (
    <img
      className="static sm:absolute flex self-center w-[20] sm:w-[28] bottom-0 right-0 m-2"
      src={earthIcon}
      alt="Earth Icon"
      width={28}
    />
  ) : elemental === "Fire" ? (
    <img
      className="static sm:absolute flex self-center w-[20] sm:w-[28] bottom-0 right-0 m-2"
      src={fireIcon}
      alt="Fire Icon"
      width={28}
    />
  ) : elemental === "Water" ? (
    <img
      className="static sm:absolute flex self-center w-[20] sm:w-[28] bottom-0 right-0 m-2"
      src={waterIcon}
      alt="Water Icon"
      width={28}
    />
  ) : (
    <></>
  );
};

const SlayerCard = ({ slayer }: { slayer: SlayerType }) => {
  return (
    <Card
      className="flex flex-col w-full bg-slayercard outline-4 hover:outline overflow-hidden cursor-pointer"
      key={slayer.name}
      onClick={() => console.log(slayer.name)}
    >
      <CardHeader className="p-2 lg:p-6">
        <CardTitle>{slayer.name}</CardTitle>
        <CardDescription>Rank: {}</CardDescription>
      </CardHeader>
      <CardContent className="flex w-full p-0">
        <div className="relative flex flex-col w-full h-full">
          <img
            src="https://picsum.photos/200"
            alt={slayer.name}
            width={350}
            className="grow w-full"
          />
          {/* Handle the Stats HUD for each skill bar */}
          {slayer && (
            <div className="flex flex-col-reverse items-center sm:items-start bottom-0 left-0 p-2 gap-0 lg:gap-1 bg-tertiary-foreground backdrop-blur-sm border-t border-foreground">
              <div className="flex gap-2 lg:gap-4 items-center">
                <img src={attackIcon} alt="Health Icon" width={16} />
                <div className="flex gap-0 md:gap-1">
                  {skillPointHud(slayer.Attack)}
                </div>
              </div>
              <div className="flex gap-2 lg:gap-4 items-center">
                <img src={defenseIcon} alt="Health Icon" width={16} />
                <div className="flex gap-0 md:gap-1">
                  {skillPointHud(slayer.Defense)}
                </div>
              </div>
              <div className="flex gap-2 lg:gap-4 items-center">
                <img src={healthIcon} alt="Health Icon" width={16} />
                <div className="flex gap-0 md:gap-1">
                  {skillPointHud(slayer.Health)}
                </div>
              </div>
              {/* Handle the elemental sign */}
              {slayer && elemenatlClass(slayer.Elemental)}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SlayerCard;
