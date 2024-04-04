import { useWalletModal } from "@vechain/dapp-kit-react";
import { useWallet } from "@vechain/dapp-kit-react";
import { WalletButton } from "@vechain/dapp-kit-react";
import { useWalletName } from "@/hooks/useWalletName";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";

export default function Wallet({
  children,
  mobile,
}: {
  children?: React.ReactNode;
  mobile?: boolean;
}) {
  const { account } = useWallet();

  if (account) return <DisconnectButton mobile={mobile} />;
  return <ConnectButton>{children}</ConnectButton>;
}

export function DisconnectButton({ mobile }: { mobile?: boolean }) {
  const wallet = useWallet();
  const { name } = useWalletName(wallet.account);

  return (
    <WalletButton
      mobile={mobile}
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

export function ConnectButton({ children }: { children?: React.ReactNode }) {
  const modal = useWalletModal();
  return (
    <Button variant="default" onClick={modal.open}>
      {children}
    </Button>
  );
}
