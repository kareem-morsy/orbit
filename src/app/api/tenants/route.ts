import { NextResponse } from "next/server";
import { delay, tenants } from "@/lib/mock-db";

export async function GET() {
  await delay(250);
  return NextResponse.json({ data: tenants });
}
