import { NextResponse } from "next/server";
import { FALLBACK_PROJECTS } from "@/lib/constants";

export const revalidate = 60; // 1 minute cache

export async function GET() {
  return NextResponse.json(FALLBACK_PROJECTS);
}
