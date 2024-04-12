import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useWallet } from "@vechain/dapp-kit-react";
import { useMetadata } from "@/hooks/useMetadata";
import { useWalletName } from "@/hooks/useWalletName";
import { truncateMiddle } from "@/lib/utils";
import { WOV_STAKING_ADDRESS, NFTLIST_API_URL, MAX_NFT_SUPPLY } from "@/config";
import { NftListType, NftMetadataType } from "@/types/types";
import { Grid, GridContent } from "@/components/ui/grid";
import { SlayerCard, SlayerCardContent } from "@/components/ui/slayercard";
import { Badge } from "@/components/ui/badge";
import SlayerCardComponent from "@/components/SlayerCardComponent";
import SlayerStatsTable from "@/components/SlayerStatsTable";
import CopyClipboard from "@/components/CopyClipboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Spinner from "@/components/Spinner";
import { usePerPage } from "@/hooks/usePerPage";

const SlayerDetailsPage = () => {
  const wallet = useWallet();
  const location = useLocation();
  const navigate = useNavigate();
  const PER_PAGE = usePerPage();
  const { tokenId } = useParams();
  const { metadata, metadataLoading } = useMetadata(Number(tokenId));
  const [slayer, setSlayer] = useState<NftListType>();
  const { name } = useWalletName(slayer?.owner || null);

  useEffect(() => {
    if (location.state?.slayer) {
      setSlayer(location.state.slayer);
    } else {
      fetch(
        NFTLIST_API_URL + `?limit=1&cursor=${(Number(tokenId) - 1).toString()}`
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

  // In the SlayerDetailsPage component
  const handleClick = () => {
    const item = Number(tokenId);
    //calculate the position of the cursor based on the tokenId
    const PAGE = Math.ceil(item / PER_PAGE);
    const MODULO = item % PER_PAGE;
    const cursor = MODULO === 0 ? item - 1 : item - MODULO;
    console.log("PAGE", PAGE);
    console.log("MODULO", MODULO);

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
        <GridContent className="pr-0 lg:pr-8">
          {slayer && metadata && (
            <SlayerCardComponent
              key={`${slayer.tokenId}-details`}
              slayer={slayer}
            />
          )}
        </GridContent>
        <GridContent className="flex-col gap-4 items-center justify-start pl-0 lg:pl-8">
          {slayer && (
            <SlayerCard>
              <SlayerCardContent>
                <h3 className="text-4xl">Owner:</h3>
                <div className="flex justify-between">
                  <CopyClipboard copyData={slayer.owner}>
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
                  </CopyClipboard>
                </div>
                {slayer.owner === WOV_STAKING_ADDRESS && (
                  <div className="flex w-full gap-4 pt-1">
                    <Badge>Staked</Badge>
                  </div>
                )}
              </SlayerCardContent>
            </SlayerCard>
          )}
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
