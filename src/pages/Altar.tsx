import React from "react";
import { Link } from "react-router-dom";
import { useConnex, useWallet } from "@vechain/dapp-kit-react";
import { SLAYER_WALLET, SLAYER_MINT_CONTRACT } from "@/config/index";
import { truncateMiddle } from "@/lib/utils";
import SlayerTokenImage from "@/assets/SL4YR_Token.png";
import {
  SlayerCard,
  SlayerCardContent,
  SlayerCardFooter,
  SlayerCardHeader,
  SlayerCardTitle,
} from "@/components/ui/slayercard";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "@/components/ui/select";
import CopyClipboard from "@/components/CopyClipboard";
import UserInfo from "@/components/UserInfo";
import TreasuryInfo from "@/components/TreasuryInfo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import InfoPanel from "@/components/InfoPanel";

export default function AltarPage() {
  const connex = useConnex();
  const { account } = useWallet();
  const { toast } = useToast();
  const [selectedValue, setSelectedValue] = React.useState(1);
  const [balance, setBalance] = React.useState(0);
  const [balanceUser, setBalanceUser] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [txId, setTxId] = React.useState("");

  // Display an error toast if there is an error message
  React.useEffect(() => {
    if (errorMessage) {
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [errorMessage]);

  React.useEffect(() => {
    if (txId) {
      toast({
        title: "Success",
        description: "Transaction submitted successfully.",
        variant: "success",
      });
    }
  }, [txId]);

  // get the balance of the slayer treasury
  React.useEffect(() => {
    if (!connex) {
      return;
    }
    connex.thor
      .account(SLAYER_WALLET)
      .get()
      .then(({ energy }: { energy: string }) => {
        setBalance(Number(BigInt(energy).toString().slice(0, -18)));
      })
      .catch((err: any) => {
        setErrorMessage(err.message ?? "Could not load treasure balance.");
      });
  }, [connex]);

  // get the balance of the logged in account
  React.useEffect(() => {
    if (!connex || !account) {
      return;
    }
    connex.thor
      .account(account)
      .get()
      .then(({ energy }: { energy: string }) => {
        setBalanceUser(Number(BigInt(energy).toString().slice(0, -18)));
      })
      .catch((err: any) => {
        setErrorMessage(err.message ?? "Could not load user balance.");
      });
  }, [connex, account]);

  const handleSelectChange = (value: string) => {
    setSelectedValue(parseInt(value));
  };

  // initiate a transaction to the slayer treasury with the selected value. creating a txid value or error message.
  const handleOffering = async () => {
    setIsLoading(true);
    setErrorMessage("");
    setTxId("");

    try {
      const vthoValue = `${selectedValue}${"0".repeat(18)}`;
      const approvalClause = connex.thor
        .account("0x0000000000000000000000000000456e65726779")
        .method({
          constant: false,
          inputs: [
            { name: "_spender", type: "address" },
            { name: "_value", type: "uint256" },
          ],
          name: "approve",
          outputs: [{ name: "success", type: "bool" }],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
        })
        .asClause(SLAYER_MINT_CONTRACT, vthoValue);

      const mintClause = connex.thor
        .account(SLAYER_MINT_CONTRACT)
        .method({
          inputs: [
            {
              internalType: "uint256",
              name: "_VTHOAmount",
              type: "uint256",
            },
          ],
          name: "swapVTHOforSL4Y",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        })
        .asClause(vthoValue);

      const { txid } = await connex.vendor
        .sign("tx", [
          {
            ...approvalClause,
            comment: `Approve access to ${selectedValue} VTHO`,
          },
          {
            ...mintClause,
            comment: `Sacrifice ${selectedValue} VTHO for SL4Y`,
          },
        ])
        .comment(`Offering to the treasury of ${selectedValue} VTHO)`)
        .signer(account)
        .request();

      setTxId(txid);
    } catch (err: any) {
      setErrorMessage(err.message ?? "An error occurred");
    } finally {
      setIsLoading(false);
      setSelectedValue(1);
    }
  };

  return (
    <section className="flex flex-col w-full h-full gap-8 lg:gap-12">
      <div className="flex flex-col h-fit lg:flex-row w-full gap-8 lg:gap-12 lg:justify-center items-center lg:items-stretch">
        <UserInfo
          account={account}
          balanceUser={balanceUser}
          selectedValue={selectedValue}
        />
        <SlayerCard className="relative w-full max-w-md p-4 overflow-visible">
          {/*           <div className="absolute top-1/2 -left-3 transform -translate-y-1/2 rotate-90 lg:top-0 lg:left-1/2 lg:-translate-x-1/2 lg:rotate-0">
            <FontAwesomeIcon
              className="drop-shadow-lg"
              icon={faArrowRight}
              size="xl"
            />
          </div> */}
          <SlayerCardHeader>
            <SlayerCardTitle className="flex flex-row justify-between text-2xl">
              Offer
              <img
                className="drop-shadow-lg"
                src={SlayerTokenImage}
                alt="Slayer Token"
                width={32}
              />
            </SlayerCardTitle>
            <p className="text-tertiary">
              Make an offering to the Slayers Guild
            </p>
          </SlayerCardHeader>
          <SlayerCardContent className="flex flex-col gap-6">
            <Select
              onValueChange={handleSelectChange}
              value={String(selectedValue)}
            >
              <SelectTrigger id="offering">
                <SelectValue placeholder="Make An Offering" />
              </SelectTrigger>
              <SelectContent position="item-aligned">
                <SelectItem value="5000">5,000 VTHO</SelectItem>
                <SelectItem value="10000">10,000 VTHO</SelectItem>
                <SelectItem value="15000">15,000 VTHO</SelectItem>
                <SelectItem value="25000">25,000 VTHO</SelectItem>
              </SelectContent>
            </Select>
            <Button
              className="w-full"
              disabled={isLoading || selectedValue < 5000 || !account}
              onClick={handleOffering}
            >
              Submit Offering
            </Button>
          </SlayerCardContent>
          {!isLoading && txId && (
            <SlayerCardFooter>
              <div className="flex flex-col gap-2 pt-6 divide-y">
                <h2>Tusen takk, your offer was successful!</h2>
                <div className="flex justify-between pt-2">
                  <CopyClipboard copyData={txId}>
                    <p className="flex text-success-foreground truncate">
                      {truncateMiddle(txId)}
                    </p>
                  </CopyClipboard>
                  <Link
                    to={`https://explore.vechain.org/transactions/${txId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-4"
                  >
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                  </Link>
                </div>
              </div>
            </SlayerCardFooter>
          )}
        </SlayerCard>
        <TreasuryInfo balance={balance} />
      </div>
      <div className="flex justify-center w-full">
        <InfoPanel />
      </div>
    </section>
  );
}
