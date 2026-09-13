import { NextRequest, NextResponse } from "next/server";
import { searchLessons } from "@/lib/search";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  const results = searchLessons(q);
  return NextResponse.json({ q, results });
}
