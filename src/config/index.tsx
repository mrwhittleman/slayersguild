export const WALLET_CONNECT_PROJECT_ID =
  process.env.WALLET_CONNECT_PROJECT_ID ?? "96fd24ee7496d99aa45dea0b6df81d41"; // obtain on https://cloud.walletconnect.com/
export const NETWORK = (process.env.NETWORK ?? "main") as "main" | "test";
export const NODE_URL =
  process.env.NODE_URL ?? `https://node-${NETWORK}net.vechain.energy`;
export const SPONSORSHIP_URL =
  process.env.SPONSORSHIP_URL ?? "https://sponsor-testnet.vechain.energy/by/90";
export const SLAYER_WALLET =
  process.env.SLAYER_WALLET ?? "0x3665eD160eDD2bC236fBDA83274eacA08769B0b9";
export const SLAYER_CONTRACT =
  process.env.SLAYER_CONTRACT ?? "0x84466753b03e2f6d74afe8bf356c09e63dd36d67";
export const SLAYER_IMAGE_URL =
  process.env.SLAYER_IMAGE_URL ??
  "https://4wz7nuijhm67qgxnqw54egbv52zocgq3qei3gbb7la5vuvowh47q.arweave.net/5bP20Qk7Pfga7YW7whg17rLhGhuBEbMEP1g7WlXWPz8/";
export const METADATA_URL =
  process.env.METADATA_URL ??
  "https://u3r3iwywduc6bsvgopanuu5ns7x3tetf6uua77ng6zft2cy6pabq.arweave.net/puO0WxYdBeDKpnPA2lOtl--5kmX1KA_9pvZLPQseeAM/";
export const NFTLIST_API_URL =
  process.env.NFTLIST_API_URL ?? "https://slayersguild-b60.pages.dev/api/nfts";
export const NFTHISTORY_API_URL =
  process.env.HISTORY_API_URL ??
  "https://slayersguild-b60.pages.dev/api/history";
export const NFTTRANSFER_API_URL =
  process.env.NFTTRANSFER_API_URL ??
  "https://slayersguild-b60.pages.dev/api/transfers";
export const WOV_STAKING_ADDRESS =
  process.env.WOV_STAKING_ADDRESS ??
  "0x4aa8053a7f44aa5ab676f0f2cb9c43ca7ff10395";
export const WOV_URL = process.env.WOV_URL ?? "https://worldofv.art";
export const MAX_NFT_SUPPLY = process.env.MAX_NFT_SUPPLY ?? "666";
