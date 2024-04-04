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
import SlayerCardGallery from "./SlayerCards";
import { NftListType } from "@/types/types";
import Spinner from "./Spinner";

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
  /*   const [cursor, setCursor] = useState(""); */
  const [pageIndex, setPageIndex] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // API URL for fetching NFTs
  const apiUrl = "https://slayersguild-b60.pages.dev/api/nfts";

  // Number of items to display depeding on device width
  const PER_PAGE = useMemo(() => {
    if (window.innerWidth < 400) {
      return 8;
    } else if (window.innerWidth < 640) {
      return 12;
    } else if (window.innerWidth < 768) {
      return 15;
    } else if (window.innerWidth < 1920) {
      return 20;
    } else if (window.innerWidth < 2560) {
      return 32;
    } else {
      return 60;
    }
  }, [window.innerWidth]);

  const lastPage = useMemo(
    () => Math.floor(TOTAL_ITEMS / PER_PAGE),
    [PER_PAGE]
  );

  // Fetch NFTs from the NFT-List API
  const fetchNfts = useCallback(
    async (pageIndex: number, direction?: string) => {
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
          if (pageIndex === 1) {
            queryParams.delete("cursor");
          } else {
            queryParams.set("cursor", ((pageIndex - 1) * PER_PAGE).toString());
          }
          break;
        case pageIndex === lastPage:
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

      const cacheEntry = cache[pageIndex];
      const isCacheValid =
        cacheEntry && Date.now() - cacheEntry.timestamp < CACHE_EXPIRY;

      if (isCacheValid) {
        setNfts(cacheEntry.data);
        cursorRef.current = cacheEntry.cursor;
        setPageIndex(cacheEntry.pageIndex);
        setLoading(false);
      } else {
        // Fetch the NFTs from the API
        try {
          const response = await fetch(apiUrl + newQueryParams);
          const data = await response.json();
          setNfts(data.page);
          const newCursor = data.cursor;
          const newPageIndex = Math.floor(Number(newCursor) / PER_PAGE);
          cursorRef.current = newCursor;
          setPageIndex(newPageIndex);
          // Update the cache entry to include cursor and pageIndex
          setCache((prevCache) => ({
            ...prevCache,
            [pageIndex]: {
              data: data.page,
              cursor: newCursor,
              pageIndex: newPageIndex,
              timestamp: Date.now(),
            },
          }));
          /* TO REMOVE!! */
          /* console.log("triggered"); */
        } catch (err: any) {
          setErrorMessage(err.message ?? "An error occurred");
        } finally {
          setLoading(false);
        }
      }
    },
    [cursorRef, cache]
  );

  // Initial fetch
  useEffect(() => {
    fetchNfts(pageIndex);
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
    <section className="relative flex flex-wrap justify-center items-center size-full gap-4 2k:gap-8">
      {!loading ? (
        <div className="grid w-full grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 1k:grid-cols-8 2k:grid-cols-10 gap-4 2k:gap-8">
          {/* Mapping through data and render the Detailed Cards */}
          {nfts.map((slayer: NftListType) => {
            const props = {
              slayer,
              className: "cursor-pointer outline-4 hover:outline",
              history: {
                limit: PER_PAGE.toString(),
                cursor: cursorRef.current,
              },
            };

            return <SlayerCardGallery key={slayer.tokenId} {...props} />;
          })}
        </div>
      ) : (
        <div className="flex w-full h-full justify-center items-center">
          <Spinner />
        </div>
      )}

      <Pagination className="sticky bottom-8 py-2 px-8 flex w-full max-w-2xl rounded-lg bg-tertiary/85 backdrop-blur-sm">
        <PaginationContent>
          <PaginationItem>
            {pageIndex > 1 ? (
              <PaginationPrevious
                onClick={handlePreviousClick}
                className="cursor-pointer hover:bg-primary/15 transition-all"
              />
            ) : (
              <PaginationPrevious className="opacity-20 pointer-events-none transition-all" />
            )}
          </PaginationItem>

          <PaginationItem>
            <PaginationLink
              className="cursor-pointer hover:bg-primary/15 transition-all focus-visible:bg-accent/65"
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
                className="hover:bg-primary/15 transition-all"
              >
                {pageIndex}
              </PaginationLink>
            </PaginationItem>
          ) : (
            <PaginationEllipsis className="mx-6" />
          )}
          <PaginationItem>
            <PaginationLink
              className="cursor-pointer hover:bg-primary/15 transition-all"
              onClick={() =>
                fetchNfts(pageIndex === lastPage ? pageIndex : lastPage)
              }
              isActive={pageIndex === lastPage}
            >
              {lastPage}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            {pageIndex < lastPage ? (
              <PaginationNext
                onClick={handleNextClick}
                className="cursor-pointer hover:bg-primary/15 transition-all"
              />
            ) : (
              <PaginationNext className="opacity-20 pointer-events-none transition-all" />
            )}
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </section>
  );
};

export default GalleryView;
