import React from "react";
import { truncateMiddle } from "@/lib/utils";
import { SLAYER_WALLET } from "@/config/index";
import {
  SlayerCard,
  SlayerCardContent,
  SlayerCardHeader,
  SlayerCardTitle,
} from "@/components/ui/slayercard";
import SlayerTokenImage from "@/assets/SL4YR_Token.png";
import VthoTokenImage from "@/assets/VTHO_Token_Icon.png";

export default function TreasuryInfo({ balance }: { balance: number }) {
  return (
    <SlayerCard className="relative w-full h-fit max-w-md p-4 overflow-visible">
      <SlayerCardHeader>
        <SlayerCardTitle className="text-2xl">Treasury Balance</SlayerCardTitle>
        {SLAYER_WALLET && (
          <p className="text-tertiary" title={SLAYER_WALLET}>
            {truncateMiddle(SLAYER_WALLET)}
          </p>
        )}
      </SlayerCardHeader>
      <SlayerCardContent>
        <div className="flex w-full justify-between">
          <div className="flex flex-col w-full gap-4 divide-y">
            <div className="flex w-full justify-between">
              <p>Balance:</p>
            </div>
            <div className="flex flex-col w-full gap-2 pt-4">
              {/* VTHO BALANCE */}
              <div className="flex w-full h-full items-center">
                <img src={VthoTokenImage} alt="VTHO Logo" width={20} />
                <p className="font-semibold px-2 w-full  text-end">{balance}</p>
                <p>VTHO</p>
              </div>
              {/*                 SL4Y BALANCE
                <div className="flex w-full gap-4 items-center">
                  <img
                    src={SlayerTokenImage}
                    alt="Slayer Logo"
                    width={20}
                  />
                  <p className="font-semibold px-2 w-full  text-end">
                    0 <span className="font-thin">SL4Y</span>
                  </p>
                </div> */}
            </div>
          </div>
        </div>
      </SlayerCardContent>
    </SlayerCard>
  );
}
