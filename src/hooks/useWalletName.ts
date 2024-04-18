import React from "react"
import { useConnex } from "@vechain/dapp-kit-react"
import { namehash, isAddress, ZeroAddress } from "ethers";
import { NETWORK } from "@/config";

const MAIN_GENESIS_ID = '0x00000000851caf3cfdb6e899cf5958bfb1ac3413d346d43539627e6be7ec1b4a'
const TEST_GENESIS_ID = '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127'

const MAIN_VET_REGISTRY_ADDRESS = "0xa9231da8BF8D10e2df3f6E03Dd5449caD600129b";
const TEST_VET_REGISTRY_ADDRESS = "0xcBFB30c1F267914816668d53AcBA7bA7c9806D13"
const VET_REGISTRY_ADDRESS = NETWORK === 'main' ? MAIN_VET_REGISTRY_ADDRESS : TEST_VET_REGISTRY_ADDRESS


export function useWalletName(address: string | null) {
    const connex = useConnex()
    const [name, setName] = React.useState<string | null>(null)

    React.useEffect(() => {
        if (
            [MAIN_GENESIS_ID, TEST_GENESIS_ID].includes(connex.thor.genesis.id)
            &&
            address
        ) {
            getName(address, connex)
                .then(setName)
                .catch((err) => {
                    console.error(err)
                    setName(null)
                })
        }
        else {
            setName(null)
        }
    }, [connex, address])

    return { name }
}


const ABI = {
    resolver: {
        inputs: [{ internalType: "bytes32", name: "node", type: "bytes32" }],
        name: "resolver",
        outputs: [{ internalType: "address", name: "resolverAddress", type: "address" }],
        stateMutability: "view",
        type: "function",
    },

    addr: {
        inputs: [{ internalType: "bytes32", name: "node", type: "bytes32" }],
        name: "addr",
        outputs: [{ internalType: "address payable", name: "address", type: "address" }],
        stateMutability: "view",
        type: "function",
    },

    name: {
        inputs: [{ internalType: "bytes32", name: "node", type: "bytes32" }],
        name: "name",
        outputs: [{ internalType: "string", name: "name", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
};


export async function getRecord(name: string, connex: Connex): Promise<string> {
    const node = namehash(name);

    const { decoded: { resolverAddress }, reverted: noResolver } = await connex.thor.account(VET_REGISTRY_ADDRESS).method(ABI.resolver).call(node);
    if (noResolver || resolverAddress === ZeroAddress) { throw new Error('Resolver not configurd') }

    const { decoded: { address }, reverted: noLookup } = await connex.thor.account(resolverAddress).method(ABI.addr).call(node);
    if (noLookup) { throw new Error('Resolver returned no address') }

    return address;
}

export async function getName(address: string, connex: Connex): Promise<string> {
    const reverseLookup = `${address.slice(2).toLowerCase()}.addr.reverse`;
    const node = namehash(reverseLookup);

    const { decoded: { resolverAddress }, reverted: noResolver } = await connex.thor.account(VET_REGISTRY_ADDRESS).method(ABI.resolver).call(node);
    if (noResolver || resolverAddress === ZeroAddress) { return ''; }


    const { decoded: { name }, reverted: noLookup } = await connex.thor.account(resolverAddress).method(ABI.name).call(node);
    if (noLookup) { return ''; }

    return name;
}

export async function getAddress(addressOrName: string, connex: Connex): Promise<string> {
    return isAddress(addressOrName) ? addressOrName : await getRecord(addressOrName, connex)
}