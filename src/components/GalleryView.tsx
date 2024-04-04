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
    if (window.innerWidth < 640) {
      return 4;
    } else if (window.innerWidth < 1024) {
      return 6;
    } else if (window.innerWidth < 1536) {
      return 8;
    } else {
      return 12;
    }
  }, [window.innerWidth]);

  const lastPage = useMemo(() => Math.ceil(TOTAL_ITEMS / PER_PAGE), [PER_PAGE]);

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
          console.log("triggered");
        } catch (err: any) {
          setErrorMessage(err.message ?? "An error occurred");
        } finally {
          setLoading(false);
        }
      }
    },
    [cursorRef]
  );

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
    <section className="flex flex-wrap justify-center items-center w-full gap-4">
      <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6 gap-4">
        {/* Mapping through data and render the Detailed Cards */}
        {nfts.map((slayer: NftListType) => {
          const props = {
            slayer,
            className: "cursor-pointer outline-4 hover:outline",
            loading,
            history: { limit: PER_PAGE.toString(), cursor: cursorRef.current },
          };

          return <SlayerCardGallery key={slayer.tokenId} {...props} />;
        })}
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            {pageIndex > 1 ? (
              <PaginationPrevious
                onClick={handlePreviousClick}
                className="cursor-pointer"
              />
            ) : (
              <PaginationPrevious className="opacity-20 pointer-events-none transition-all" />
            )}
          </PaginationItem>

          <PaginationItem>
            <PaginationLink
              className="cursor-pointer"
              onClick={handleFirstPageClick}
              isActive={pageIndex === 1}
            >
              {1}
            </PaginationLink>
          </PaginationItem>

          {pageIndex > 1 && pageIndex < lastPage ? (
            <PaginationItem className="mx-6">
              <PaginationLink isActive>{pageIndex}</PaginationLink>
            </PaginationItem>
          ) : (
            <PaginationEllipsis className="mx-6" />
          )}
          <PaginationItem>
            <PaginationLink
              className="cursor-pointer"
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
                className="cursor-pointer"
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
