import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePerPage } from "@/hooks/usePerPage";
import {
  fetchNftsFromApi,
  getInitialPageIndex,
  getQueryParams,
  paginationLogic,
} from "@/lib/utils";
import { MAX_NFT_SUPPLY } from "@/config";
import { NftListType } from "@/types/types";
import { useToast } from "@/components/ui/use-toast";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Grid, GridContent, GridGallery } from "@/components/ui/grid";
import SlayerCardComponent from "@/components/SlayerCardComponent";
import Spinner from "@/components/Spinner";

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
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Number of items to display depeding on device width
  const PER_PAGE = usePerPage();
  const lastPage = useMemo(() => Math.ceil(MAX_ITEMS / PER_PAGE), [PER_PAGE]);

  // Fetch NFTs from the NFT-List API
  // Initial fetch
  useEffect(() => {
    const { newPageIndex, cursor } = getInitialPageIndex();
    setPageIndex(newPageIndex);
    cursorRef.current = cursor ?? "";

    (async () => {
      setLoading(true);
      setErrorMessage("");

      const queryParams = getQueryParams(PER_PAGE);
      const newQueryParams = "?" + queryParams.toString();
      const cacheEntry = JSON.parse(
        sessionStorage.getItem(`cache_${newPageIndex}`) || "null"
      );
      const isCacheValid =
        cacheEntry && Date.now() - cacheEntry.timestamp < 30000; // 30 seconds

      if (cacheEntry && isCacheValid) {
        setNfts(cacheEntry.page);
        cursorRef.current = cacheEntry.cursor;
        setPageIndex(newPageIndex);
      } else {
        try {
          const data = await fetchNftsFromApi(newQueryParams);
          setNfts(data.page);
          cursorRef.current = data.cursor;
          setPageIndex(newPageIndex);
          sessionStorage.setItem(
            `cache_page_${newPageIndex}`,
            JSON.stringify({
              page: data.page,
              cursor: data.cursor,
              timestamp: Date.now(),
            })
          );
        } catch (err: any) {
          setErrorMessage(err.message ?? "An error occurred");
        } finally {
          setLoading(false);
        }
      }
    })();
  }, [location.search]);

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
