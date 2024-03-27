import { z } from 'zod'

const pagiginationSchema = z.object({
    cursor: z.string().optional(),
    limit: z.number().min(1).max(100)
})

type ApiRequest = {
    net: 'mainnet' | 'testnet',
    limit: string,
    lastItemPrimary?: string,
    sortingField?: 'tokenId',
    sortingDirection?: 'asc' | 'desc'
}

type Env = {
    VORJ_API_KEY?: string;
    SLAYER_CONTRACT?: string;
}

type Erc721Result = {
    totalItems: number,
    totalPages: number,
    page: Array<{
        tokenId: string,
        metadataUri: string,
        owner: string
    }>
} | { message: string }

export async function onRequest({ request, env }: { request: Request, env: Env }): Promise<Response> {
    try {

        if (!env.VORJ_API_KEY) { throw new Error('VORJ_API_KEY is not set') }
        if (!env.SLAYER_CONTRACT) { throw new Error('SLAYER_CONTRACT is not set') }

        const query = new URL(request.url)
        const { cursor: lastItemPrimary, limit } = pagiginationSchema.parse({
            cursor: query.searchParams.get('cursor') ?? undefined,
            limit: Number(query.searchParams.get('limit') ?? 100)
        })

        const apiRequest: ApiRequest = {
            net: 'mainnet',
            limit: limit.toString(),
            sortingField: 'tokenId',
            sortingDirection: 'asc'
        }
        if (lastItemPrimary) { apiRequest.lastItemPrimary = lastItemPrimary }

        const apiQueryParams = new URLSearchParams(apiRequest);
        const result = await fetch(`https://api.vorj.app/main/v2/erc721/contracts/${encodeURIComponent(env.SLAYER_CONTRACT)}?${apiQueryParams.toString()}`, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'x-api-key': env.VORJ_API_KEY
            }
        }).then(response => response.json()) as Erc721Result

        if ('message' in result) { throw new Error(result.message) }

        const cursor = apiRequest.sortingField && result.page.length > 0 && result.page[result.page.length - 1]![apiRequest.sortingField]
        return new Response(JSON.stringify({ ...result, cursor }), {
            status: 200,
            headers: {
                'content-type': 'application/json; charset=UTF-8'
            }
        })

    }
    catch (err: any) {
        console.error(err)
        return new Response(JSON.stringify({ errorMessage: err.shortMessage || err.message }), {
            status: 200,
            headers: {
                'content-type': 'application/json; charset=UTF-8'
            }
        })
    }
}
