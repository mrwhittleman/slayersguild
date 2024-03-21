import { useNftList } from '~/src/hooks/useNftList';
import { useWallet } from '@vechain/dapp-kit-react';

export default function MySlayerPage() {
    const { account } = useWallet();
    const { balance, isLoading, tokens } = useNftList(account);

    return (
        <>
            <div>My Slayer</div>
            <div>Your Tokens: {balance}</div>
            {isLoading
                ? <div>Loading...</div>
                : tokens.map(token => (<div key={token.tokenId}>{token.tokenId}: {token.tokenURI}</div>))
            }
        </>
    )
}