import { useWalletModal } from "@vechain/dapp-kit-react";
import { useWallet } from "@vechain/dapp-kit-react";
import { WalletButton } from "@vechain/dapp-kit-react";
import { useWalletName } from "@/hooks/useWalletName";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightToBracket, faBook } from "@fortawesome/free-solid-svg-icons";

export default function Wallet() {
  const { account } = useWallet();

  if (account) return <DisconnectButton />;
  return <ConnectButton />;
}

export function DisconnectButton() {
  const wallet = useWallet();
  const { name } = useWalletName(wallet.account);

  return (
    <WalletButton
      address={
        name
          ? name.length <= 8
            ? name.replace(".vet", " .vet")
            : name
          : wallet.account
      }
    />
  );
}

export function ConnectButton() {
  const modal = useWalletModal();
  return (
    <Button variant="default" onClick={modal.open}>
      <FontAwesomeIcon icon={faRightToBracket} />
      <span className="ml-2">Connect</span>
    </Button>
  );
}
