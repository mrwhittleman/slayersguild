import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useWallet } from "@vechain/dapp-kit-react";
import { useMetadata } from "@/hooks/useMetadata";
import { useWalletName } from "@/hooks/useWalletName";
import { usePerPage } from "@/hooks/usePerPage";
import { stakingCheck, truncateMiddle } from "@/lib/utils";
import { WOV_STAKING_ADDRESS, API_URL } from "@/config";
import { NftListType } from "@/types/types";
import { Grid, GridContent } from "@/components/ui/grid";
import { SlayerCard, SlayerCardContent } from "@/components/ui/slayercard";
import { Badge } from "@/components/ui/badge";
import SlayerCardComponent from "@/components/SlayerCardComponent";
import SlayerStatsTable from "@/components/SlayerStatsTable";
import CopyClipboard from "@/components/CopyClipboard";
import Spinner from "@/components/Spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const SlayerDetailsPage = () => {
  const wallet = useWallet();
  const location = useLocation();
  const navigate = useNavigate();
  const PER_PAGE = usePerPage();
  const { tokenId } = useParams();
  const { metadata, metadataLoading } = useMetadata(Number(tokenId));
  const [slayer, setSlayer] = useState<NftListType>();
  const { name } = useWalletName(slayer?.owner || null);
  const [staked, setStaked] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if there is a slayer in the location state or fetch the slayer from the API based on the tokenId in the URL
  useEffect(() => {
    if (location.state.slayer) {
      setSlayer(location.state.slayer);
      if (location.state.staked) setStaked(location.state.staked);
    } else {
      fetch(
        `${API_URL}/nfts?limit=1&cursor=${(Number(tokenId) - 1).toString()}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }
          return response.json();
        })
        .then((data) => setSlayer(data.page[0]))
        .catch((error) => console.error(error));
    }
  }, [location.state, tokenId]);

  // Check if the slayer owner is the staking contract, if so, fetch the original owner
  useEffect(() => {
    if (slayer?.owner !== WOV_STAKING_ADDRESS) {
      return;
    }
    setLoading(true);
    setStaked(true);
    stakingCheck(slayer.tokenId)
      .then((owner) => {
        setSlayer((prev) => ({
          ...prev,
          owner,
          tokenId: prev?.tokenId ?? slayer.tokenId,
        }));
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [slayer]);

  // Handle the click event for the back button
  const handleClick = () => {
    const item = Number(tokenId);
    //calculate the position of the cursor based on the tokenId
    const MODULO = item % PER_PAGE;
    const cursor = MODULO === 0 ? item - 1 : item - MODULO;
    // Check if the location state exists and navigate back to the previous page
    if (location.state) navigate(-1);
    // else the navigation should go to the gallery view with the limit needed and the cursor set to the current page of the tokenId
    else navigate(`/gallery?limit=${PER_PAGE}&cursor=${cursor.toString()}`);
  };

  return (
    <section className="flex flex-col w-full gap-4">
      <div className="self-center">
        {/* BACK BUTTON */}
        <a
          className="text-2xl hover:text-tertiary transition-all"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleClick();
          }}
        >
          <FontAwesomeIcon icon={faArrowLeft} size="xs" className="mr-2" />
          Back
        </a>
      </div>
      <Grid className="grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-0 lg:divide-x">
        {/* SLAYER CARD */}
        <GridContent className="pr-0 lg:pr-8">
          {slayer && metadata && (
            <SlayerCardComponent
              key={`${slayer.tokenId}-details`}
              slayer={slayer}
            />
          )}
        </GridContent>
        {/* SLAYER INFO */}
        <GridContent className="flex-col gap-4 items-center justify-start pl-0 lg:pl-8">
          {slayer && (
            /* SLAYER OWNER CARD */
            <SlayerCard>
              <SlayerCardContent>
                <h3 className="text-4xl">Owner:</h3>
                <div className="flex gap-1">
                  <CopyClipboard copyData={slayer.owner}>
                    {!loading ? (
                      <p
                        className="text-base md:text-xl lg:text-base xl:text-lg text-tertiary"
                        title={slayer.owner}
                      >
                        {slayer.owner === wallet.account
                          ? `You: ${
                              name
                                ? name.length <= 8
                                  ? name.replace(".vet", " .vet")
                                  : name
                                : truncateMiddle(wallet.account)
                            }`
                          : name
                          ? name.length <= 8
                            ? name.replace(".vet", " .vet")
                            : name
                          : truncateMiddle(slayer.owner)}
                      </p>
                    ) : (
                      <div className="flex w-full h-full items-center p-2">
                        <Spinner className="w-4 h-4" />
                      </div>
                    )}
                  </CopyClipboard>
                </div>
                {staked && <Badge className="w-fit">Staked</Badge>}
              </SlayerCardContent>
            </SlayerCard>
          )}
          {/* SLAYER STATS TABLE */}
          <SlayerCard>
            <SlayerCardContent>
              {!metadataLoading && metadata ? (
                <SlayerStatsTable attributes={metadata.attributes} />
              ) : (
                <div className="flex w-full h-full justify-center items-center">
                  <Spinner />
                </div>
              )}
            </SlayerCardContent>
          </SlayerCard>
        </GridContent>
      </Grid>
    </section>
  );
};

export default SlayerDetailsPage;
