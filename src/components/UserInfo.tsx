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

  const handleClickShowBalance = () => {
    setShowBalanceUser(!showBalanceUser);
  };

  return (
    <SlayerCard className="relative w-full h-fit max-w-md p-4 overflow-visible">
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
                <button onClick={handleClickShowBalance}>
                  {!showBalanceUser ? (
                    <FontAwesomeIcon icon={faEye} size="lg" />
                  ) : (
                    <FontAwesomeIcon icon={faEyeSlash} size="lg" />
                  )}
                </button>
              </div>
              <div className="flex flex-col w-full gap-2 pt-4">
                {/* VTHO BALANCE */}
                <div className="flex w-full h-full items-center">
                  <img src={VthoTokenImage} alt="VTHO Logo" width={20} />
                  {showBalanceUser ? (
                    <>
                      <p
                        className={`font-semibold px-2 w-full  text-end ${
                          selectedValue > balanceUser &&
                          "text-destructive animate-pulse"
                        }`}
                      >
                        {balanceUser}{" "}
                      </p>
                      <p>VTHO</p>
                    </>
                  ) : (
                    <p className="bg-white/65 w-full h-full ml-8 px-2 py-3 rounded-full" />
                  )}
                </div>
                {/* SL4Y BALANCE
                <div className="flex w-full h-full gap-4 items-center">
                  <img src={SlayerTokenImage} alt="Slayer Logo" width={20} />
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
          <p>Please connect your wallet</p>
        </SlayerCardContent>
      )}
    </SlayerCard>
  );
}
