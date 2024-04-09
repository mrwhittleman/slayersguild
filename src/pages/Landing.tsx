import SlayerCardComponent from "@/components/SlayerCardComponent";
import React from "react";

const randomSlayer = () => {
  return {
    tokenId: Math.floor(Math.random() * 666).toString(),
  };
};

const LandingPage = () => {
  return (
    <div className="relative flex w-full h-full items-center justify-center overflow-hidden">
      <div className="flex w-fit h-fit opacity-55">
        <SlayerCardComponent
          slayer={randomSlayer()}
          type="dummy"
          className="absolute left-0 right-0 top-0 bottom-0 m-auto w-[320px] [--rotate-distance:3deg] [--translate-distance:-312px] delay-500 shadow-lg animate-cards-slide"
        />
        <SlayerCardComponent
          slayer={randomSlayer()}
          type="dummy"
          className="absolute left-0 right-0 top-0 bottom-0 m-auto w-[320px] [--rotate-distance:-7deg] [--translate-distance:-128px] delay-500 shadow-lg animate-cards-slide"
        />
        <SlayerCardComponent
          slayer={randomSlayer()}
          type="dummy"
          className="absolute left-0 right-0 top-0 bottom-0 m-auto w-[320px] [--rotate-distance:3deg] [--translate-distance:87px] delay-500 shadow-lg animate-cards-slide"
        />
        <SlayerCardComponent
          slayer={randomSlayer()}
          type="dummy"
          className="absolute left-0 right-0 top-0 bottom-0 m-auto w-[320px] [--rotate-distance:-5deg] [--translate-distance:325px] delay-500 shadow-lg animate-cards-slide"
        />
      </div>
      <div className="absolute w-fit h-fit left-0 right-0 top-0 bottom-0 m-auto flex flex-col items-center justify-center gap-4">
        <h1 className="text-4xl sm:text-6xl lg:text-8xl">
          Vechain Slayers Guild
        </h1>
        <p className="text-lg sm:text-xl lg:text-2xl text-center text-tertiary-foreground font-semibold">
          X-nodes will be destroyed. But Slayers never die.
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
