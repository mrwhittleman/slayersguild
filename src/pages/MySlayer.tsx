import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useWallet } from "@vechain/dapp-kit-react";
import { useWalletName } from "@/hooks/useWalletName";
import { useNftList } from "@/hooks/useNftList";
import { transfersCheck, truncateMiddle } from "@/lib/utils";
import { WOV_URL } from "@/config";
import { NftListType, StakedNftType } from "@/types/types";
import { Grid, GridContent, GridGallery } from "@/components/ui/grid";
import Spinner from "@/components/Spinner";
import SlayerCardComponent from "@/components/SlayerCardComponent";
import CopyClipboard from "@/components/CopyClipboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";

const MySlayerPage = () => {
  const wallet = useWallet();
  const { name } = useWalletName(wallet.account);
  const {
    balance,
    isLoading: loadingNftList,
    tokens,
  } = useNftList(wallet.account);
  const [stakedTokens, setStakedTokens] = useState<StakedNftType[]>([]);
  const [loadingTransferCheck, setLoadingTransferCheck] = useState(false);
  const isLoading = loadingNftList || loadingTransferCheck;

  // Check if wallet account is connected and check the transfers of the current wallet account for transfers to the staking contract and set the stakedNfts state
  useEffect(() => {
    const loadData = async () => {
      setLoadingTransferCheck(true);
      const cache = JSON.parse(
        sessionStorage.getItem("stakedTokensCache") || "{}"
      );
      let data = cache.data || [];
      const lastUpdated = cache.lastUpdated;

      if (!lastUpdated || Date.now() - lastUpdated > 30000) {
        data = await transfersCheck(wallet.account!);
        sessionStorage.setItem(
          "stakedTokensCache",
          JSON.stringify({
            data,
            lastUpdated: Date.now(),
          })
        );
      }

      setStakedTokens(data);
      setLoadingTransferCheck(false);
    };

    if (wallet.account) {
      loadData();
    }
  }, [wallet.account]);

  // If wallet account is not connected, display a message to connect the wallet
  if (!wallet.account) {
    return (
      <div className="flex flex-col w-full items-center gap-4">
        <h3 className="text-2xl text-center">
          Please connect with your Vechain wallet to see your Slayer collection.
        </h3>
      </div>
    );
  }
  // If wallet account is connected, display the slayer collection of the wallet account (staked and not staked slayers)
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
          ) : tokens.length > 0 ? (
            balance
          ) : stakedTokens.length > 0 ? (
            stakedTokens.length
          ) : (
            "0"
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
              {tokens.length > 0 || stakedTokens.length > 0 ? (
                <GridGallery>
                  {/* NOT STAKED SLAYERS */}
                  {tokens.map((token, idx) => {
                    const slayer = {
                      tokenId: token.tokenId,
                      owner: wallet.account,
                    } as NftListType;

                    return (
                      <SlayerCardComponent
                        key={`${token.tokenId}-gallery-${idx}`}
                        slayer={slayer}
                        type="link"
                        className="cursor-pointer outline-4 hover:outline"
                      />
                    );
                  })}
                  {/* STAKED SLAYERS */}
                  {stakedTokens.map(
                    (token: { tokenId: string }, idx: number) => {
                      const slayer = {
                        tokenId: token.tokenId,
                        owner: wallet.account,
                      } as NftListType;

                      return (
                        <SlayerCardComponent
                          key={`${token.tokenId}-gallery-${idx}`}
                          slayer={slayer}
                          type="link"
                          staked={true}
                          className="cursor-pointer outline-4 hover:outline"
                        />
                      );
                    }
                  )}
                </GridGallery>
              ) : (
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
              <p className="max-w-md">
                In the realm of Eldoria, 666 fierce warriors known as Slayers,
                inspired by Nordic mythology, rose to confront the spreading
                chaos caused by the proliferation of X-Nodes. These Slayers,
                clad in rugged armor and wielding ancient weapons, embarked on a
                perilous quest led by High Chief Ragnar Stormheart. Along their
                journey, they battled monsters and confronted dark forces,
                forging bonds of brotherhood amidst the crucible of battle.
                <br />
                <br />
                Their ultimate adversary was the Archon of the X-Nodes, a
                powerful entity threatening to engulf Eldoria in darkness. In a
                climactic showdown, the Slayers vanquished the Archon and
                destroyed the X-Nodes, restoring peace to their land. Though
                their quest was over, the Slayers remained vigilant, ready to
                face new threats and protect Eldoria from the shadows that
                lurked beyond.
              </p>
              <h1>Soon&trade;</h1>
            </GridContent>
          </Grid>
        )}
      </div>
    </div>
  );
};

export default MySlayerPage;
