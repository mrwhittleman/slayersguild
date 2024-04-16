import { z } from "zod";

const transferSchema = z.object({
  address: z.string(),
  limit: z.number().min(1).max(100),
});

type ApiRequest = {
  net: "mainnet" | "testnet";
  limit: string;
  sortingDirection?: "asc" | "desc";
};

type Env = {
  VORJ_API_KEY?: string;
  SLAYER_CONTRACT?: string;
};

type Erc721Result = {
  totalItems: number;
  totalPages: number;
  page: Array<{
    txID: string;
    transfers: Array<{
      contract: string;
      from: string;
      to: string;
      tokenId: string;
      amount: string;
    }>;
  }>;
};

export async function onRequest({
  request,
  env,
}: {
  request: Request;
  env: Env;
}): Promise<Response> {
  try {
    if (!env.VORJ_API_KEY) {
      throw new Error("VORJ_API_KEY is not set");
    }
    if (!env.SLAYER_CONTRACT) {
      throw new Error("SLAYER_CONTRACT is not set");
    }

    const query = new URL(request.url);
    const { address, limit } = transferSchema.parse({
      address: query.searchParams.get("address"),
      limit: Number(query.searchParams.get("limit") ?? 100),
    });

    const apiRequest: ApiRequest = {
      net: "mainnet",
      limit: limit.toString(),
      sortingDirection: "desc",
    };

    const apiQueryParams = new URLSearchParams(apiRequest);
    const result = (await fetch(
      `https://api.vorj.app/main/v2/erc721/contracts/${encodeURIComponent(
        env.SLAYER_CONTRACT
      )}/transfers/${address}?${apiQueryParams.toString()}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          "x-api-key": env.VORJ_API_KEY,
        },
      }
    ).then((response) => response.json())) as Erc721Result;

    if ("message" in result) {
      throw new Error(result.message as string);
    }

    return new Response(JSON.stringify({ ...result }), {
      status: 200,
      headers: {
        "content-type": "application/json; charset=UTF-8",
      },
    });
  } catch (err: any) {
    console.error(err);
    return new Response(
      JSON.stringify({ errorMessage: err.shortMessage || err.message }),
      {
        status: 200,
        headers: {
          "content-type": "application/json; charset=UTF-8",
        },
      }
    );
  }
}
