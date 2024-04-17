import React from "react";
import { SlayerCard, SlayerCardContent } from "./ui/slayercard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const InfoPanel = () => {
  return (
    <div className="flex flex-col lg:flex-row w-full items-center lg:items-start lg:justify-center h-full gap-8 lg:gap-12">
      <SlayerCard className="flex flex-col w-full h-fit p-4 overflow-visible max-w-md divide-y">
        <Accordion type="multiple">
          <AccordionItem value="item-1">
            <AccordionTrigger>Info</AccordionTrigger>
            <AccordionContent>
              <SlayerCardContent className="w-full">
                <div className="flex flex-col w-full pb-8 lg:pb-0 lg:pr-8">
                  <p className="mb-2">
                    As Slayers make an offering, they mint and receive SL4Y
                    tokens. These tokens will power the Slayers Guild dApp and
                    future Slayer Item marketplace.
                  </p>
                  <ul className="list-disc list-inside">
                    <li className="mb-1">
                      Limited Supply: 666,666 SL4Y Tokens
                      <ul className="list-disc list-inside pl-5">
                        <li>
                          This total supply number was derived from an
                          approximation of how much it would cost to slay the
                          remaining X-nodes.
                        </li>
                      </ul>
                    </li>
                    <li>
                      No pre-mint. SL4Y tokens can only be minted through the
                      offering portal, and are minted on-demand.
                    </li>
                  </ul>
                </div>
              </SlayerCardContent>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Accordion type="multiple">
          <AccordionItem value="item-2">
            <AccordionTrigger>VTHO/SL4Y Rates</AccordionTrigger>
            <AccordionContent>
              <SlayerCardContent className="w-full">
                <div className="flex flex-col w-full pt-8 lg:pt-0 lg:pl-8">
                  <p className="mb-2">
                    The Guild Treasury Wallet will accept VTHO donations in set
                    amounts. Each donation will result in receiving SL4Y, the
                    official Slayers Guild token.
                  </p>
                  <ul className="list-disc list-inside">
                    <li className="mb-1">5,000 VTHO = 5 SL4Y</li>
                    <li className="mb-1">10,000 VTHO = 10 SL4Y</li>
                    <li className="mb-1">15,000 VTHO = 20 SL4Y</li>
                    <li className="mb-1">25,000 VTHO = 40 SL4Y</li>
                  </ul>
                  <p className="mt-2">
                    1 SL4Y = ~625 - 1000 VTHO, scaling with the more VTHO you
                    donate.
                  </p>
                </div>
              </SlayerCardContent>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </SlayerCard>
    </div>
  );
};

export default InfoPanel;
