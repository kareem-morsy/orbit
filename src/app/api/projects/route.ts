import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { delay, projects } from "@/lib/mock-db";
import { authorizeMockRequest, isAuthError } from "@/lib/api/mock-auth";

const createProjectSchema = z.object({
  tenantId: z.string().min(1),
  name: z.string().min(3).max(80),
  description: z.string().min(10).max(240),
  status: z.enum(["planning", "active", "completed"]),
  dueDate: z.iso.date(),
});

export async function GET(request: NextRequest) {
  await delay();
  const auth = authorizeMockRequest(request);
  if (isAuthError(auth)) return auth;

  const params = request.nextUrl.searchParams;
  const tenantId = params.get("tenantId");
  if (!tenantId) return NextResponse.json({ error: "tenantId is required" }, { status: 400 });
  if (tenantId !== auth.tenantId) {
    return NextResponse.json({ error: "Cross-tenant access denied" }, { status: 403 });
  }

  const search = params.get("search")?.toLowerCase() ?? "";
  const status = params.get("status") ?? "all";
  const page = Math.max(1, Number(params.get("page")) || 1);
  const limit = Math.min(20, Math.max(1, Number(params.get("limit")) || 6));
  const filtered = projects.filter((project) =>
    project.tenantId === tenantId &&
    (status === "all" || project.status === status) &&
    (project.name.toLowerCase().includes(search) || project.description.toLowerCase().includes(search))
  );
  const start = (page - 1) * limit;
  return NextResponse.json({
    data: filtered.slice(start, start + limit),
    meta: { page, limit, total: filtered.length, totalPages: Math.ceil(filtered.length / limit) },
  });
}

export async function POST(request: NextRequest) {
  await delay(650);
  const auth = authorizeMockRequest(request, { adminOnly: true });
  if (isAuthError(auth)) return auth;

  const parsed = createProjectSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid project data", issues: z.treeifyError(parsed.error) }, { status: 422 });
  }
  if (parsed.data.tenantId !== auth.tenantId) {
    return NextResponse.json({ error: "Cross-tenant access denied" }, { status: 403 });
  }
  const project = {
    id: `p-${Date.now()}`, ...parsed.data, progress: 0, members: 1, tasks: [],
  };
  projects.unshift(project);
  return NextResponse.json({ data: project }, { status: 201 });
}
