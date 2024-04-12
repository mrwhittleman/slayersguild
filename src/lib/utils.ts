import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncateMiddle(text: string | undefined, maxLength = 8) {
  if (text && text.length <= maxLength) {
    return text;
  }
  if (text) {
    const start = text.substring(0, maxLength / 2);
    const end = text.substring(text.length - maxLength / 2, text.length);
    return `${start}...${end}`;
  }
  return null;
}

export function getQueryParams(PER_PAGE: number) {
  const queryParams = new URLSearchParams(location.search);
  queryParams.set("limit", PER_PAGE.toString());
  return queryParams;
}

export function paginationLogic(
  navigate: any,
  cursorRef: React.MutableRefObject<string>,
  pageIndex: number,
  lastPage: number,
  TOTAL_ITEMS: number,
  PER_PAGE: number,
  direction?: string | undefined
) {
  const currentPath = location.pathname;
  const queryParams = new URLSearchParams(location.search);
  queryParams.set("limit", PER_PAGE.toString());

  if (direction === "next") {
    queryParams.set("cursor", cursorRef.current);
  } else if (direction === "prev") {
    if (pageIndex === 1) {
      queryParams.delete("cursor");
    } else {
      queryParams.set("cursor", ((pageIndex - 1) * PER_PAGE).toString());
    }
  } else if (pageIndex === lastPage) {
    queryParams.set(
      "cursor",
      (TOTAL_ITEMS - (TOTAL_ITEMS % PER_PAGE)).toString()
    );
  } else if (direction === "firstPage") {
    queryParams.delete("cursor");
  } else {
    return;
  }
  const newQueryParams = "?" + queryParams.toString();
  navigate(currentPath + newQueryParams);
}

export function getInitialPageIndex() {
  const queryParams = new URLSearchParams(location.search);
  const cursor = queryParams.get("cursor");
  const newPageIndex = cursor
    ? Math.floor(Number(cursor) / Number(queryParams.get("limit")) + 1)
    : 1;

  return { queryParams, cursor, newPageIndex };
}

export function isCacheEntryValid(cacheEntry: any, CACHE_EXPIRY: number) {
  return cacheEntry && Date.now() - cacheEntry.timestamp < CACHE_EXPIRY;
}

export function setNftCache(
  setNfts: any,
  cursorRef: any,
  setPageIndex: any,
  setLoading: any,
  cacheEntry: any
) {
  setNfts(cacheEntry.data);
  cursorRef.current = cacheEntry.cursor;
  setPageIndex(cacheEntry.pageIndex);
  setLoading(false);
}

export function updateNftCache(
  setCache: any,
  newPageIndex: number,
  data: any,
  newCursor: string
) {
  setCache((prevCache: any) => ({
    ...prevCache,
    [newPageIndex]: {
      data: data.page,
      cursor: newCursor,
      pageIndex: newPageIndex,
      timestamp: Date.now(),
    },
  }));
}

export async function fetchNftsFromApi(
  NFTLIST_API_URL: string,
  newQueryParams: string
) {
  const response = await fetch(NFTLIST_API_URL + newQueryParams);
  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }
  const data = await response.json();
  return data;
}

export async function fetchNftHistoryFromApi(
  NFTHISTORY_API_URL: string,
  tokenId: string
) {
  console.log(NFTHISTORY_API_URL + `?tokenId=${tokenId}`);
  const response = await fetch(NFTHISTORY_API_URL + `?tokenId=${tokenId}`);
  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }
  const data = await response.json();
  return data;
}
