export const WALLET_CONNECT_PROJECT_ID = process.env.WALLET_CONNECT_PROJECT_ID ?? '' // obtain on https://cloud.walletconnect.com/
export const NETWORK = (process.env.NETWORK ?? 'test') as 'main' | 'test'
export const NODE_URL = process.env.NODE_URL ?? `https://node-${NETWORK}net.vechain.energy`
export const SPONSORSHIP_URL = process.env.SPONSORSHIP_URL ?? 'https://sponsor-testnet.vechain.energy/by/90'
export const SLAYER_WALLET =  process.env.SLAYER_WALLET ?? '0x0000000000000000000000000000456e65726779'