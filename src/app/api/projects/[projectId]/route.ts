import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { delay, projects } from "@/lib/mock-db";
import { authorizeMockRequest, isAuthError } from "@/lib/api/mock-auth";

const updateTaskSchema = z.object({
  taskId: z.string(),
  status: z.enum(["todo", "in_progress", "done"]),
});

export async function GET(request: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
  await delay();
  const auth = authorizeMockRequest(request);
  if (isAuthError(auth)) return auth;

  const { projectId } = await params;
  const requestedTenant = request.nextUrl.searchParams.get("tenantId");
  if (requestedTenant !== auth.tenantId) {
    return NextResponse.json({ error: "Cross-tenant access denied" }, { status: 403 });
  }
  const project = projects.find((item) => item.id === projectId && item.tenantId === auth.tenantId);
  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
  return NextResponse.json({ data: project });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
  await delay(350);
  const auth = authorizeMockRequest(request, { adminOnly: true });
  if (isAuthError(auth)) return auth;

  const { projectId } = await params;
  const requestedTenant = request.nextUrl.searchParams.get("tenantId");
  if (requestedTenant !== auth.tenantId) {
    return NextResponse.json({ error: "Cross-tenant access denied" }, { status: 403 });
  }
  const project = projects.find((item) => item.id === projectId && item.tenantId === auth.tenantId);
  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
  const parsed = updateTaskSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid task update" }, { status: 422 });
  const task = project.tasks.find((item) => item.id === parsed.data.taskId);
  if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });
  task.status = parsed.data.status;
  return NextResponse.json({ data: task });
}
