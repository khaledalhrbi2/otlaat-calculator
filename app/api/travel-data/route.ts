import { NextResponse } from "next/server";
import { getTravelData } from "@/lib/data";

export const revalidate = 300;

export async function GET() {
  const data = await getTravelData();
  return NextResponse.json(data);
}
