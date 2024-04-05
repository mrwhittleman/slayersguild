import { useLocation, useNavigate } from "react-router-dom";
import SlayerCardComponent from "@/components/SlayerCards";
import SlayerStatsTable from "@/components/SlayerStatsTable";
import CopyClipboard from "@/components/CopyClipboard";
import { SlayerCard, SlayerCardContent } from "@/components/ui/slayercard";

const SlayerDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { slayer, slayerMetadata, limit, cursor } = location.state;

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
    // Generate the new URL with the newQueryParams
    let queryParams = new URLSearchParams(location.search);
    // Set the cursor one page back to not jumpt one page further everytime
    const cursorBack = cursor - limit;
    queryParams.set("limit", limit.toString());
    queryParams.set("cursor", cursorBack.toString());

    /*  queryParams.set("cursor", cursor.toString()); */
    const newUrl = `/gallery?${queryParams.toString()}`;

    // Navigate back to the gallery view with the new URL
    navigate(newUrl);
  };

  return (
    <section className="flex flex-col w-full justify-center items-center">
      <div className="pb-12">
        {/* BACK BUTTON */}
        <a
          className="text-2xl hover:text-tertiary-foreground transition-all"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleClick();
          }}
        >
          Back
        </a>
      </div>
      <div className="w-full grid grid-cols-1 divide-y lg:grid-cols-2 lg:divide-x lg:divide-y-0">
        <div className="basis-1 lg:basis-1/2 flex justify-center py-8 lg:py-0 lg:px-8">
          <SlayerCardComponent
            key={`${slayer.tokenId}-details`}
            slayer={slayer}
            className="h-fit"
          />
        </div>
        <div className="basis-1 lg:basis-1/2 flex flex-col py-8 lg:py-0 lg:px-8 items-center gap-4">
          <SlayerCard className="w-full max-w-lg">
            <SlayerCardContent>
              <h3 className="text-4xl">Owner:</h3>
              <div className="flex justify-between">
                <p className="text-base md:text-xl lg:text-base xl:text-lg text-tertiary-foreground">
                  {truncateMiddle(slayer?.owner)}
                </p>
                <CopyClipboard copyData={slayer.owner} />
              </div>
            </SlayerCardContent>
          </SlayerCard>
          <div className="w-full max-w-lg">
            <SlayerCard>
              <SlayerCardContent>
                <SlayerStatsTable attributes={slayerMetadata.attributes} />
              </SlayerCardContent>
            </SlayerCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SlayerDetailsPage;
