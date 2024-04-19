import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useWallet } from "@vechain/dapp-kit-react";
import { useWalletName } from "@/hooks/useWalletName";
import { useNftList } from "@/hooks/useNftList";
import { stakedCheck, truncateMiddle } from "@/lib/utils";
import { WOV_URL } from "@/config";
import { AllSlayersType, NftListType, StakedNftType } from "@/types/types";
import { useToast } from "@/components/ui/use-toast";
import { Grid, GridContent, GridGallery } from "@/components/ui/grid";
import Spinner from "@/components/Spinner";
import SlayerCardComponent from "@/components/SlayerCardComponent";
import CopyClipboard from "@/components/CopyClipboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";

const MySlayerPage = () => {
  const { toast } = useToast();
  const wallet = useWallet();
  const { name } = useWalletName(wallet.account);
  const { isLoading: loadingNftList, tokens } = useNftList(wallet.account);
  const [stakedSlayers, setStakedSlayers] = useState<StakedNftType[]>([]);
  const [allSlayers, setAllSlayers] = useState<AllSlayersType[]>([]);
  const [loadingTransferCheck, setLoadingTransferCheck] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const isLoading = loadingNftList || loadingTransferCheck;

  useEffect(() => {
    const loadData = async () => {
      setLoadingTransferCheck(true);
      try {
        const data = await stakedCheck(wallet.account!);
        sessionStorage.setItem(
          "stakedTokensCache",
          JSON.stringify({
            data,
            lastUpdated: Date.now(),
          })
        );
        setStakedSlayers(data);
      } catch (err: any) {
        setErrorMessage(err.message ?? "Could not fetch stakedNfts.");
      } finally {
        setLoadingTransferCheck(false);
      }
    };

    const cache = JSON.parse(
      sessionStorage.getItem("stakedTokensCache") || "{}"
    );
    const lastUpdated = cache.lastUpdated;

    if (
      wallet.account &&
      !loadingNftList &&
      (!lastUpdated || Date.now() - lastUpdated > 30000)
    ) {
      loadData();
    } else if (wallet.account && cache.data) {
      setStakedSlayers(cache.data);
    }
  }, [wallet.account]);

  useEffect(() => {
    const markedStakedSlayers = stakedSlayers.map((slayer) => ({
      ...slayer,
      staked: true,
    }));
    const allSlayers = [...tokens, ...markedStakedSlayers].sort(
      (a, b) => parseInt(a.tokenId) - parseInt(b.tokenId)
    );
    setAllSlayers(allSlayers);
  }, [stakedSlayers, tokens]);

  useEffect(() => {
    if (errorMessage) {
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [errorMessage]);

  if (!wallet.account) {
    return (
      <div className="flex flex-col w-full items-center gap-4">
        <h3 className="text-2xl text-center">
          Please connect with your Vechain wallet to see your Slayer collection.
        </h3>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      {/* WELCOME MESSAGE AND WALLET ACCOUNT INFO */}
      <div className="flex w-fit items-end gap-4">
        <h3 className="text-4xl">Skol,</h3>
        <CopyClipboard copyData={wallet.account}>
          <p className="text-4xl text-tertiary" title={wallet.account}>
            {name
              ? name.length <= 8
                ? name.replace(".vet", " .vet")
                : name
              : truncateMiddle(wallet.account)}
          </p>
        </CopyClipboard>
      </div>
      <div className="flex h-full w-full flex-col gap-8">
        {/* USER SLAYER COLLECTION INFO */}
        <p className="flex gap-1">
          You currently own{" "}
          {isLoading ? (
            <Spinner className="w-3 h-3 self-center" />
          ) : (
            tokens.length + stakedSlayers.length
          )}{" "}
          Slayer!
        </p>
        {isLoading ? (
          <div className="flex w-full h-full justify-center items-center">
            <Spinner />
          </div>
        ) : (
          /* SLAYER VIEW */
          <Grid className="grid-cols-1 lg:grid-cols-2 divide-x-0 lg:divide-x divide-y lg:divide-y-0">
            <GridContent className="pr-0 lg:pr-8 pb-8 lg:pb-0">
              <GridGallery>
                {/* NOT STAKED SLAYERS */}
                {allSlayers.length > 0 &&
                  allSlayers.map((item, idx) => {
                    const slayer = {
                      tokenId: item.tokenId,
                      owner: wallet.account,
                    } as NftListType;

                    return (
                      <SlayerCardComponent
                        key={`${item.tokenId}-notstaked-${idx}`}
                        slayer={slayer}
                        type="link"
                        className="cursor-pointer outline-4 hover:outline"
                        staked={item.staked && item.staked}
                      />
                    );
                  })}
              </GridGallery>
              {tokens.length === 0 &&
                stakedSlayers.length === 0 &&
                !errorMessage && (
                  /* If no slayers found -> info + buy button */
                  <div className="flex flex-col w-full h-full justify-center items-center gap-4">
                    <p className="text-2xl">No Slayer found.</p>
                    <Link
                      to={`${WOV_URL}/collection/Slayers`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center px-4 py-2 rounded-lg bg-tertiary hover:bg-tertiary/65 hover:scale-110 transition-all"
                    >
                      <FontAwesomeIcon icon={faCartShopping} size="xl" />
                    </Link>
                  </div>
                )}
            </GridContent>
            {/* FILLER FOR FUTURE STUFF */}
            <GridContent className="flex-col gap-4 justify-start lg:items-start pl-0 lg:pl-8 pt-8 lg:pt-0">
              <h1>Coming soon...</h1>
            </GridContent>
          </Grid>
        )}
      </div>
    </div>
  );
};

export default MySlayerPage;
