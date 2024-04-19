import { API_URL, WOV_STAKING_ADDRESS } from "@/config";
import { NftHistoryType, NftTransferType } from "@/types/types";
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
  MAX_NFT_SUPPLY: number,
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
      (MAX_NFT_SUPPLY - (MAX_NFT_SUPPLY % PER_PAGE)).toString()
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

export async function fetchNftsFromApi(newQueryParams: string) {
  const response = await fetch(`${API_URL}/nfts${newQueryParams}`);
  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }
  const data = await response.json();
  return data;
}

export async function fetchNftHistoryFromApi(tokenId: string) {
  const response = await fetch(
    `${API_URL}/history?tokenId=${tokenId}&event=Staked`
  );
  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }
  const data = await response.json();
  return data;
}

export async function getOriginalOwner(tokenId: string) {
  try {
    const data = await fetchNftHistoryFromApi(tokenId);
    const stakedEvent = data.page.find(
      (item: NftHistoryType) => item.event === "Staked"
    );
    return stakedEvent.from;
  } catch (error) {
    throw new Error("Could not fetch original owner.");
  }
}

export async function fetchTransfersFromApi(address: string) {
  const response = await fetch(`${API_URL}/transfers?address=${address}`);
  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }
  const data = await response.json();
  return data;
}

export async function stakedCheck(address: string): Promise<
  {
    contract: string;
    from: string;
    to: string;
    tokenId: string;
    amount: string;
  }[]
> {
  try {
    const data: NftTransferType = await fetchTransfersFromApi(address);
    const transfers = data.page.flatMap((page) => page.transfers);

    // Filter for staked transfers
    const stakeTransfers = transfers.filter(
      (item) => item.from === address && item.to === WOV_STAKING_ADDRESS
    );

    // Filter for unstaked transfers
    const unstakeTransfers = transfers.filter(
      (item) => item.to === address && item.from === WOV_STAKING_ADDRESS
    );

    // Get staked tokens that have not been unstaked and sort them
    const stakedSlayers = stakeTransfers
      .filter(
        (staked) =>
          !unstakeTransfers.some(
            (unstaked) => unstaked.tokenId === staked.tokenId
          )
      )
      .sort((a, b) => parseInt(a.tokenId) - parseInt(b.tokenId));
    return stakedSlayers;
  } catch (error) {
    throw new Error("Could not fetch stakedNfts.");
  }
}
