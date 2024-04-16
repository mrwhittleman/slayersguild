import React from "react";
import { useConnex } from "@vechain/dapp-kit-react";
import { SLAYER_WALLET, SPONSORSHIP_URL, NETWORK } from "@/config/index";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "@/components/ui/select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export default function AltarPage() {
  const connex = useConnex();
  const { toast } = useToast();
  const [selectedValue, setSelectedValue] = React.useState(1);
  const [balance, setBalance] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [txId, setTxId] = React.useState("");

  const handleSelectChange = (value: string) => {
    setSelectedValue(parseInt(value));
  };

  // initiate a transaction to the slayer treasury with the selected value. creating a txid value or error message.
  const handleOffering = async () => {
    setIsLoading(true);
    setErrorMessage("");
    setTxId("");

    try {
      const transferClause = connex.thor
        .account("0x0000000000000000000000000000456e65726779")
        .method({
          constant: false,
          inputs: [
            { name: "_to", type: "address" },
            { name: "_amount", type: "uint256" },
          ],
          name: "transfer",
          outputs: [{ name: "success", type: "bool" }],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
        })
        .asClause(SLAYER_WALLET, `${selectedValue}${"0".repeat(18)}`);

      const { txid } = await connex.vendor
        .sign("tx", [transferClause])
        .delegate(SPONSORSHIP_URL)
        .comment(`Offering to the treasury of ${selectedValue} VTHO)`)
        .request();

      setTxId(txid);
    } catch (err: any) {
      setErrorMessage(err.message ?? "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

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

  // error handling of the offering with toast message
  React.useEffect(() => {
    if (errorMessage) {
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [errorMessage]);

  // success handling of the offering with toast txId
  React.useEffect(() => {
    if (txId) {
      toast({
        title: "Success",
        description: "Your transaction has been sent with ID: " + txId,
        variant: "success",
      });
    }
  }, [txId]);

  // truncate the txId for display
  const truncateMiddle = (text: string, maxLength = 20) => {
    if (text.length <= maxLength) {
      return text;
    }

    const start = text.substring(0, maxLength / 2);
    const end = text.substring(text.length - maxLength / 2, text.length);

    return `${start}...${end}`;
  };

  // copy txid to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(txId);
    toast({
      title: "Copied",
      description: "Transaction ID copied to clipboard",
    });
  };

  // open an new tab to inspect the txid on vechain exoplorer
  const handleInspect = () => {
    window
      .open(
        `https://explore-${NETWORK}net.vechain.org/transactions/${txId}`,
        "_blank"
      )
      ?.focus();
  };

  return (
    <section className="flex flex-col w-full items-center">
      <Card className="w-full max-w-md bg-slayercard">
        <CardHeader>
          <CardTitle className="text-2xl">Offering</CardTitle>
          <div className="flex gap-4">
            <p className="">Treasury Balance:</p>
            <p className="">{balance} VTHO</p>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Select
            onValueChange={handleSelectChange}
            value={String(selectedValue)}
          >
            <SelectTrigger id="offering">
              <SelectValue placeholder="Make An Offering" />
            </SelectTrigger>
            <SelectContent position="item-aligned">
              <SelectItem value="1">1 VTHO</SelectItem>
              <SelectItem value="10000">10,000 VTHO</SelectItem>
              <SelectItem value="15000">15,000 VTHO</SelectItem>
              <SelectItem value="25000">25,000 VTHO</SelectItem>
            </SelectContent>
          </Select>
          <Button
            className="w-full"
            disabled={isLoading}
            onClick={handleOffering}
          >
            Submit Offerings
          </Button>

          {txId && (
            <div className="bg-success p-4 rounded-lg">
              <h2>Transaction ID:</h2>
              <div className="flex justify-between">
                <p className="flex text-success-foreground truncate">
                  {truncateMiddle(txId)}
                </p>
                <div className="flex gap-4">
                  <button onClick={handleCopy}>
                    <FontAwesomeIcon icon={faCopy} />
                  </button>
                  <button onClick={handleInspect}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
