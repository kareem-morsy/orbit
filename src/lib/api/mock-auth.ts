import { NextRequest, NextResponse } from "next/server";
import { tenants } from "@/lib/mock-db";
import type { Role } from "@/types";

type AuthContext = { role: Role; tenantId: string };

export function authorizeMockRequest(
  request: NextRequest,
  options: { adminOnly?: boolean } = {},
): AuthContext | NextResponse {
  const role = request.headers.get("x-user-role");
  const tenantId = request.headers.get("x-tenant-id");

  if ((role !== "admin" && role !== "member") || !tenantId) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  if (!tenants.some((tenant) => tenant.id === tenantId)) {
    return NextResponse.json({ error: "Unknown workspace" }, { status: 403 });
  }

  if (options.adminOnly && role !== "admin") {
    return NextResponse.json({ error: "Administrator permission required" }, { status: 403 });
  }

  return { role, tenantId };
}

export function isAuthError(value: AuthContext | NextResponse): value is NextResponse {
  return value instanceof NextResponse;
}
