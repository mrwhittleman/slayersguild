import React from 'react';
import { Button } from "@/components/ui/button"
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select"
import { useConnex } from "@vechain/dapp-kit-react"
import { SLAYER_WALLET, SPONSORSHIP_URL } from "~/src/config"

export default function OfferingPage() {
    const connex = useConnex();

    const [selectedValue, setSelectedValue] = React.useState(25000);
    const [balance, setBalance] = React.useState(0);

    const [isLoading, setIsLoading] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');
    const [txId, setTxId] = React.useState('');

    const handleSelectChange = (value: string) => {
        setSelectedValue(parseInt(value));
    }

    const handleOffering = async () => {
        setIsLoading(true);
        setErrorMessage('');
        setTxId('');

        try {
            const transferClause = connex.thor
                .account('0x0000000000000000000000000000456e65726779')
                .method({
                    "constant": false,
                    "inputs": [
                        { "name": "_to", "type": "address" },
                        { "name": "_amount", "type": "uint256" }],
                    "name": "transfer",
                    "outputs": [{ "name": "success", "type": "bool" }],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function"
                })
                .asClause(SLAYER_WALLET, `${selectedValue}${'0'.repeat(18)}`)

            const { txid } = await connex.vendor
                .sign('tx', [transferClause])
                .delegate(SPONSORSHIP_URL)
                .comment(`Offering to the treasury of ${selectedValue} VTHO)`)
                .request();

            setTxId(txid);
        }
        catch (err: any) {
            setErrorMessage(err.message ?? 'An error occurred')
        }
        finally {
            setIsLoading(false);
        }
    }

    React.useEffect(() => {
        if (!connex) { return }
        connex.thor
            .account(SLAYER_WALLET)
            .get()
            .then(({ energy }: { energy: string }) => {
                setBalance(Number(BigInt(energy).toString().slice(0, -18)));
            })
            .catch((err: any) => {
                setErrorMessage(err.message ?? 'Could not load treasure balance.')
            })
    }, [connex])

    return (
        <div className="bg-[#1c2533] p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="mb-6">
                <h2 className="text-lg font-semibold mb-1">Treasury Balance:</h2>
                <p className="text-xl font-bold">{balance} VTHO</p>
            </div>
            <div className="mb-4">
                <Select onValueChange={handleSelectChange} value={String(selectedValue)} >
                    <SelectTrigger id="offering">
                        <SelectValue placeholder="Make An Offering" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                        <SelectItem value="1">1 VTHO</SelectItem>
                        <SelectItem value="25000">25,000 VTHO</SelectItem>
                        <SelectItem value="50000">50,000 VTHO</SelectItem>
                        <SelectItem value="100000">100,000 VTHO</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Button
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={isLoading}
                onClick={handleOffering}
            >
                Submit Offering
            </Button>

            {errorMessage && (
                <div className="border-l-4 border-red-400 bg-red-50 p-4 mt-4">
                    <div className="flex text-foreground">
                        {errorMessage}
                    </div>
                </div>
            )}

            {txId && (
                <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4 mt-4">
                    <div className="flex text-foreground">
                        Your transaction has been sent with ID: {txId}
                    </div>
                </div>
            )}
        </div>
    )
}