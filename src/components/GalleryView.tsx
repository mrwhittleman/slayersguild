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
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import SlayerCardComponent from "./SlayerCardComponent";
import { NftListType } from "@/types/types";
import Spinner from "./Spinner";
import { Grid, GridContent, GridGallery } from "./ui/grid";

interface CacheEntry {
  data: NftListType[];
  timestamp: number;
  cursor: string;
  pageIndex: number;
}

// Constants for pagination until further implementation
const TOTAL_ITEMS = 666;
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

  // API URL for fetching NFTs
  //check if env variable is available othewise use https://slayersguild-b60.pages.dev/api/nfts
  const apiUrl =
    process.env.REACT_APP_NFT_LIST_API ||
    "https://slayersguild-b60.pages.dev/api/nfts";

  // Number of items to display depeding on device width
  const PER_PAGE = useMemo(() => {
    if (window.innerWidth < 400) {
      return 8;
    } else if (window.innerWidth < 640) {
      return 12;
    } else if (window.innerWidth <= 768) {
      return 15;
    } else if (window.innerWidth <= 1920) {
      return 24;
    } else {
      return 40;
    }
  }, [window.innerWidth]);

  const lastPage = useMemo(
    () => Math.floor(TOTAL_ITEMS / PER_PAGE),
    [PER_PAGE]
  );

  // Fetch NFTs from the NFT-List API
  const fetchNfts = useCallback(
    async (newPageIndex: number, direction?: string) => {
      setLoading(true);
      setErrorMessage("");

      // Get the current path and query params
      const currentPath = location.pathname;
      const queryParams = new URLSearchParams(location.search);
      queryParams.set("limit", PER_PAGE.toString());

      // Pagination logic
      switch (true) {
        case direction === "next":
          queryParams.set("cursor", cursorRef.current);
          break;
        case direction === "prev":
          if (newPageIndex === 1) {
            queryParams.delete("cursor");
          } else {
            queryParams.set(
              "cursor",
              ((newPageIndex - 1) * PER_PAGE).toString()
            );
          }
          break;
        case newPageIndex === lastPage:
          queryParams.set(
            "cursor",
            (TOTAL_ITEMS - (TOTAL_ITEMS % PER_PAGE)).toString()
          );
          break;
        case direction === "firstPage":
          queryParams.delete("cursor");
          break;
        default:
          break;
      }

      // Setting the new query params and navigating to the new URL
      const newQueryParams = "?" + queryParams.toString();
      navigate(currentPath + newQueryParams);

      const cacheEntry = cache[newPageIndex];
      const isCacheValid =
        cacheEntry && Date.now() - cacheEntry.timestamp < CACHE_EXPIRY;

      if (isCacheValid) {
        setNfts(cacheEntry.data);
        cursorRef.current = cacheEntry.cursor;
        setPageIndex(cacheEntry.pageIndex);
        setLoading(false);
        console.log("triggerCache");
      } else {
        // Fetch the NFTs from the API
        try {
          const response = await fetch(apiUrl + newQueryParams);
          const data = await response.json();
          setNfts(data.page);
          const newCursor = data.cursor;
          cursorRef.current = newCursor;
          setPageIndex(newPageIndex);
          // Update the cache entry to include cursor and pageIndex
          setCache((prevCache) => ({
            ...prevCache,
            [newPageIndex]: {
              data: data.page,
              cursor: newCursor,
              pageIndex: newPageIndex,
              timestamp: Date.now(),
            },
          }));
        } catch (err: any) {
          setErrorMessage(err.message ?? "An error occurred");
        } finally {
          setLoading(false);
          console.log("triggeredAPI");
        }
      }
    },
    [cursorRef, cache, PER_PAGE, navigate]
  );

  // Initial fetch
  useEffect(() => {
    // Check if the query params contain a cursor and thus are page 1 or not (for initial fetch) if not, fetch the NFTs for that page and the right pageIndex
    const queryParams = new URLSearchParams(location.search);
    const cursor = queryParams.get("cursor");
    let newPageIndex;

    if (cursor) {
      newPageIndex = Math.floor(Number(cursor) / PER_PAGE + 1);
    } else {
      newPageIndex = 1;
    }

    // Restore the previous pageIndex and cursor values
    setPageIndex(newPageIndex);
    cursorRef.current = cursor ?? "";
    fetchNfts(newPageIndex);
  }, []);

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
  const handlePreviousClick = useCallback(() => {
    fetchNfts(pageIndex - 1, "prev");
  }, [fetchNfts, pageIndex]);

  const handleNextClick = useCallback(() => {
    fetchNfts(pageIndex + 1, "next");
  }, [fetchNfts, pageIndex]);

  const handleFirstPageClick = useCallback(() => {
    fetchNfts(1, "firstPage");
  }, [fetchNfts]);

  return (
    <>
      {!loading ? (
        <section className="relative flex flex-wrap justify-center items-center gap-4 2k:gap-8">
          <Grid>
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

          <Pagination className="sticky bottom-0 md:bottom-8 py-2 px-4 flex w-screen md:max-w-2xl md:rounded-lg bg-tertiary-foreground md:bg-tertiary-foreground/85 backdrop-blur-sm select-none left-0 right-0 ml-[-4rem] mr-[-4rem]">
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
                  onClick={() =>
                    fetchNfts(pageIndex === lastPage ? pageIndex : lastPage)
                  }
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
        </section>
      ) : (
        <div className="flex w-full h-full justify-center items-center">
          <Spinner />
        </div>
      )}
    </>
  );
};

export default GalleryView;
