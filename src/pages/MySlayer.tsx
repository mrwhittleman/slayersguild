import { useWalletName } from "@/hooks/useWalletName";
import { useWallet } from "@vechain/dapp-kit-react";
import { useNftList } from "@/hooks/useNftList";
import Spinner from "@/components/Spinner";

const MySlayerPage = () => {
  const wallet = useWallet();
  const { name } = useWalletName(wallet.account);
  const { balance, isLoading, tokens } = useNftList(wallet.account);

  if (!wallet.account) {
    return (
      <div className="flex flex-col w-full items-center justify-center gap-4">
        <h3 className="text-2xl text-center">
          Please connect with your Vechain wallet to see your Slayer collection.
        </h3>
      </div>
    );
  }
  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex items-end gap-4">
        <h3 className="text-4xl">Hello</h3>
        <p className="text-xl text-tertiary-foreground">
          {name
            ? name.length <= 8
              ? name.replace(".vet", " .vet")
              : name
            : wallet.account}
        </p>
      </div>
      <div>
        <div>Your Tokens: {balance}</div>
        {isLoading ? (
          <Spinner />
        ) : (
          tokens.map((token) => (
            <div key={token.tokenId}>
              {token.tokenId}: {token.tokenURI}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MySlayerPage;
