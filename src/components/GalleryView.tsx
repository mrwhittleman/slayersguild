import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useToast } from "./ui/use-toast";
import { useLocation, useNavigate } from "react-router-dom";
import {
  fetchNftsFromApi,
  getInitialPageIndex,
  getQueryParams,
  isCacheEntryValid,
  paginationLogic,
  setNftCache,
  updateNftCache,
} from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Grid, GridContent, GridGallery } from "./ui/grid";
import SlayerCardComponent from "./SlayerCardComponent";
import Spinner from "./Spinner";
import { NftListType } from "@/types/types";
import { MAX_NFT_SUPPLY, NFTLIST_API_URL } from "@/config";
import { usePerPage } from "@/hooks/usePerPage";

interface CacheEntry {
  data: NftListType[];
  timestamp: number;
  cursor: string;
  pageIndex: number;
}

// Set the maximum number of items
const MAX_ITEMS = Number(MAX_NFT_SUPPLY);
// Cache expiry time in milliseconds
const CACHE_EXPIRY = 5 * 60 * 1000;

const GalleryView = () => {
  const cursorRef = useRef("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [nfts, setNfts] = useState<NftListType[]>([]);
  const [cache, setCache] = useState<Record<number, CacheEntry>>({});
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Number of items to display depeding on device width
  const PER_PAGE = usePerPage();
  const lastPage = useMemo(
    () => Math.ceil(Number(MAX_ITEMS) / PER_PAGE),
    [PER_PAGE]
  );

  useEffect(() => {
    console.log("PER_PAGE:", PER_PAGE);
    console.log("lastPage:", lastPage);
  }, [PER_PAGE, lastPage]);

  // Fetch NFTs from the NFT-List API
  // Initial fetch
  useEffect(() => {
    // Check if the query params contain a cursor and thus are page 1 or not (for initial fetch) if not, fetch the NFTs for that page and the right pageIndex
    const { newPageIndex, cursor } = getInitialPageIndex();
    // Restore the previous pageIndex and cursor values
    setPageIndex(newPageIndex);
    cursorRef.current = cursor ?? "";

    // Fetch the NFTs
    (async () => {
      setLoading(true);
      setErrorMessage("");

      // Get the query params
      const queryParams = getQueryParams(PER_PAGE);
      // Setting the new query params
      const newQueryParams = "?" + queryParams.toString();
      // Check if the cache entry is valid
      const cacheEntry = cache[newPageIndex];
      const isCacheValid = isCacheEntryValid(cacheEntry, CACHE_EXPIRY);

      if (cacheEntry && isCacheValid) {
        setNftCache(setNfts, cursorRef, setPageIndex, setLoading, cacheEntry);
      } else {
        // Fetch the NFTs from the API
        try {
          const data = await fetchNftsFromApi(NFTLIST_API_URL, newQueryParams);
          setNfts(data.page);
          const newCursor = data.cursor;
          cursorRef.current = newCursor;
          setPageIndex(newPageIndex);
          // Update the cache entry to include cursor and pageIndex
          updateNftCache(setCache, newPageIndex, data, newCursor);
        } catch (err: any) {
          setErrorMessage(err.message ?? "An error occurred");
        } finally {
          setLoading(false);
        }
      }
    })();
  }, [location.search]); // Add any other dependencies here

  // Display an error toast if there is an error message
  useEffect(() => {
    if (errorMessage) {
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [errorMessage]);

  // Click handlers for pagination
  const handlePaginationClick = (pageIndex: number, direction?: string) => {
    paginationLogic(
      navigate,
      cursorRef,
      pageIndex,
      lastPage,
      MAX_ITEMS,
      PER_PAGE,
      direction
    );
    navigate(location.pathname + "?" + getQueryParams(PER_PAGE).toString());
  };

  const handlePreviousClick = useCallback(() => {
    handlePaginationClick(pageIndex - 1, "prev");
  }, [handlePaginationClick, pageIndex]);

  const handleNextClick = useCallback(() => {
    handlePaginationClick(pageIndex + 1, "next");
  }, [handlePaginationClick, pageIndex]);

  const handleFirstPageClick = useCallback(() => {
    handlePaginationClick(1, "firstPage");
  }, [handlePaginationClick]);

  return (
    <div className="relative flex flex-col items-center w-full h-full gap-4 2k:gap-8">
      {!loading ? (
        <Grid className="flex h-full">
          <GridContent>
            <GridGallery>
              {/* Mapping through data and render the Detailed Cards */}
              {nfts.map((slayer: NftListType, index) => {
                return (
                  <SlayerCardComponent
                    key={`${slayer.tokenId}-gallery-${index}`}
                    slayer={slayer}
                    className="cursor-pointer outline-4 hover:outline"
                    type="link"
                  />
                );
              })}
            </GridGallery>
          </GridContent>
        </Grid>
      ) : (
        <div className="flex w-full h-full justify-center items-center">
          <Spinner />
        </div>
      )}
      <Pagination className="sticky bottom-0 md:bottom-8 py-2 px-4 flex w-screen md:max-w-2xl md:rounded-lg bg-tertiary md:bg-tertiary/85 backdrop-blur-sm select-none left-0 right-0 ml-[-4rem] mr-[-4rem]">
        <PaginationContent className="flex w-full">
          <PaginationItem className="mr-auto">
            {pageIndex > 1 ? (
              <PaginationPrevious
                onClick={handlePreviousClick}
                className="cursor-pointer h-12 w-fit min-w-12 lg:h-10 hover:bg-primary/15 transition-all"
              />
            ) : (
              <PaginationPrevious className="opacity-20 h-12 w-fit min-w-12 lg:h-10 pointer-events-none transition-all" />
            )}
          </PaginationItem>

          <PaginationItem>
            <PaginationLink
              className="cursor-pointer h-12 lg:h-10 hover:bg-primary/15 transition-all focus-visible:bg-accent/65"
              onClick={handleFirstPageClick}
              isActive={pageIndex === 1}
            >
              {1}
            </PaginationLink>
          </PaginationItem>

          {pageIndex > 1 && pageIndex < lastPage ? (
            <PaginationItem className="mx-6">
              <PaginationLink
                isActive
                className="hover:bg-primary/15 h-12 lg:h-10 transition-all"
              >
                {pageIndex}
              </PaginationLink>
            </PaginationItem>
          ) : (
            <PaginationEllipsis className="mx-6 h-12 lg:h-10" />
          )}
          <PaginationItem>
            <PaginationLink
              className="cursor-pointer h-12 lg:h-10 hover:bg-primary/15 transition-all"
              onClick={() => handlePaginationClick(lastPage)}
              isActive={pageIndex === lastPage}
            >
              {lastPage}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem className="ml-auto">
            {pageIndex < lastPage ? (
              <PaginationNext
                onClick={handleNextClick}
                className="cursor-pointer h-12 w-fit min-w-12 lg:h-10 hover:bg-primary/15 transition-all"
              />
            ) : (
              <PaginationNext className="opacity-20 pointer-events-none h-12 w-fit min-w-12 lg:h-10 transition-all" />
            )}
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default GalleryView;
