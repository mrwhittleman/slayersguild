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
