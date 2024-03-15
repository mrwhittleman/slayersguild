import { Button } from "@/components/ui/button"
import { useWalletModal } from "@vechain/dapp-kit-react"
import { useWalletName } from '../hooks/useWalletName';
import { useWallet } from "@vechain/dapp-kit-react"
import { WalletButton } from '@vechain/dapp-kit-react';


export default function Wallet() {
    const { account } = useWallet()

    if (account) return <DisconnectButton />
    return <ConnectButton />
}

export function DisconnectButton() {
    const wallet = useWallet()
    const { name } = useWalletName(wallet.account)

    return (
        <WalletButton
            address={name ? name.length <= 8 ? name.replace('.vet', ' .vet') : name : wallet.account}
        />
    )
}

export function ConnectButton() {
    const modal = useWalletModal()
    return (
        <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={modal.open}
        >
            Connect Wallet
        </Button>
    )
}