import { useLocation, useNavigate } from "react-router-dom";
import SlayerCardComponent from "@/components/SlayerCardComponent";
import SlayerStatsTable from "@/components/SlayerStatsTable";
import CopyClipboard from "@/components/CopyClipboard";
import { SlayerCard, SlayerCardContent } from "@/components/ui/slayercard";
import { useWallet } from "@vechain/dapp-kit-react";
import { useWalletName } from "@/hooks/useWalletName";
import { Grid, GridContent, GridGallery } from "@/components/ui/grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const SlayerDetailsPage = () => {
  const wallet = useWallet();
  const location = useLocation();
  const navigate = useNavigate();
  const { slayer, slayerMetadata } = location.state;

  const { name } = useWalletName(slayer.owner);

  const truncateMiddle = (text: string, maxLength = 20) => {
    if (text.length <= maxLength) {
      return text;
    }
    const start = text.substring(0, maxLength / 2);
    const end = text.substring(text.length - maxLength / 2, text.length);
    return `${start}...${end}`;
  };

  // In the SlayerDetailsPage component
  const handleClick = () => {
    navigate(-1);
  };

  return (
    <section className="flex flex-col w-full gap-4">
      <div className="self-center">
        {/* BACK BUTTON */}
        <a
          className="text-2xl hover:text-tertiary-foreground transition-all"
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
          <SlayerCardComponent
            key={`${slayer.tokenId}-details`}
            slayer={slayer}
          />
        </GridContent>
        <GridContent className="flex-col gap-4 items-center justify-start pl-0 lg:pl-8">
          <SlayerCard>
            <SlayerCardContent>
              <h3 className="text-4xl">Owner:</h3>
              <div className="flex justify-between">
                <p className="text-base md:text-xl lg:text-base xl:text-lg text-tertiary-foreground">
                  {slayer.owner === wallet.account
                    ? `You: ${
                        name
                          ? name.length <= 8
                            ? name.replace(".vet", " .vet")
                            : name
                          : wallet.account
                      }`
                    : name
                    ? name.length <= 8
                      ? name.replace(".vet", " .vet")
                      : name
                    : truncateMiddle(slayer.owner)}
                </p>
                <CopyClipboard copyData={slayer.owner} />
              </div>
            </SlayerCardContent>
          </SlayerCard>
          <SlayerCard>
            <SlayerCardContent>
              <SlayerStatsTable attributes={slayerMetadata.attributes} />
            </SlayerCardContent>
          </SlayerCard>
        </GridContent>
      </Grid>
    </section>
  );
};

export default SlayerDetailsPage;
