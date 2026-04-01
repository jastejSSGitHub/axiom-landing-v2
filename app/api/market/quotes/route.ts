import { getBatchQuotes } from "@/lib/market-data/yahoo";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const symbolsParam = req.nextUrl.searchParams.get("symbols");
  if (!symbolsParam) {
    return Response.json({ error: "symbols required" }, { status: 400 });
  }

  const symbols = symbolsParam
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  try {
    const quotes = await getBatchQuotes(symbols);
    return Response.json(quotes, {
      headers: { "Cache-Control": "private, no-store, max-age=0" },
    });
  } catch {
    return Response.json({ error: "Failed to fetch quotes" }, { status: 500 });
  }
}
