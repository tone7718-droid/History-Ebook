import { NextResponse } from "next/server";
import { getQuizQuestionBank } from "@/lib/content";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({})) as { ids?: unknown };
  const ids = Array.isArray(body.ids) ? body.ids.filter((id): id is string => typeof id === "string").slice(0, 80) : [];
  const all = getQuizQuestionBank();
  return NextResponse.json(Object.fromEntries(ids.flatMap((id) => all[id] ? [[id, all[id]]] : [])));
}
