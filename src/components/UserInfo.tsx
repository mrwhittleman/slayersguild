import React from "react";
import { useWalletName } from "@/hooks/useWalletName";
import { truncateMiddle } from "@/lib/utils";
import {
  SlayerCard,
  SlayerCardContent,
  SlayerCardHeader,
  SlayerCardTitle,
} from "@/components/ui/slayercard";
import SlayerTokenImage from "@/assets/SL4YR_Token.png";
import VthoTokenImage from "@/assets/VTHO_Token_Icon.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function UserInfo({
  account,
  balanceUser,
  selectedValue,
}: {
  account: string | null;
  balanceUser: number;
  selectedValue: number;
}) {
  const { name } = useWalletName(account);
  const [showBalanceUser, setShowBalanceUser] = React.useState(false);

  const hanbleClickShowBalance = () => {
    setShowBalanceUser(!showBalanceUser);
  };

  return (
    <SlayerCard className="relative w-full max-w-md p-4 overflow-visible">
      <div className="absolute top-1/2 -left-4 transform -translate-y-1/2 lg:top-0 lg:left-1/2 lg:-translate-x-1/2">
        <img
          className="drop-shadow-lg w-8 h-8 lg:w-10 lg:h-10"
          src={VthoTokenImage}
          alt="VTHO Token"
          width={45}
        />
      </div>
      <SlayerCardHeader>
        <SlayerCardTitle className="text-2xl">Wallet Balance</SlayerCardTitle>
        {account && (
          <p className="text-tertiary" title={account}>
            {name
              ? name.length <= 8
                ? name.replace(".vet", " .vet")
                : name
              : truncateMiddle(account)}
          </p>
        )}
      </SlayerCardHeader>
      {account ? (
        <SlayerCardContent>
          <div className="flex w-full justify-between">
            <div className="flex flex-col w-full gap-4 divide-y">
              <div className="flex w-full justify-between">
                <p>Balance:</p>
                <button onClick={hanbleClickShowBalance}>
                  {!showBalanceUser ? (
                    <FontAwesomeIcon icon={faEye} size="lg" />
                  ) : (
                    <FontAwesomeIcon icon={faEyeSlash} size="lg" />
                  )}
                </button>
              </div>
              <div className="flex flex-col w-full gap-2 pt-4">
                {/* VTHO BALANCE */}
                <div className="flex w-full h-full gap-4 items-center">
                  <img
                    src={VthoTokenImage}
                    alt="VTHO Logo"
                    width={20}
                    className="h-fit"
                  />
                  {showBalanceUser ? (
                    <p
                      className={`font-semibold px-2 w-full  text-end ${
                        selectedValue > balanceUser &&
                        "text-destructive animate-pulse"
                      }`}
                    >
                      {balanceUser}{" "}
                      <span className="font-thin text-primary animate-none">
                        VTHO
                      </span>
                    </p>
                  ) : (
                    <p className="bg-white/65 w-full  h-full px-2 py-3 rounded-full" />
                  )}
                </div>
                {/* SL4Y BALANCE
                  <div className="flex w-full h-full gap-4 items-center">
                    <img
                      src={SlayerTokenImage}
                      alt="Slayer Logo"
                      width={20}
                      className="h-fit"
                    />
                    {showBalanceUser ? (
                      <p className="font-semibold px-2 w-full  text-end">
                        0 <span className="font-thin">SL4Y</span>
                      </p>
                    ) : (
                      <p className="bg-white/65 w-full  h-full px-2 py-3 rounded-full" />
                    )}
                  </div> */}
              </div>
            </div>
          </div>
        </SlayerCardContent>
      ) : (
        <SlayerCardContent>
          <p className="text-center">Please connect your wallet</p>
        </SlayerCardContent>
      )}
    </SlayerCard>
  );
}
