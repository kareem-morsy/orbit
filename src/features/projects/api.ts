import { apiClient } from "@/lib/api/client";
import type { ApiResponse, Project, Role, TaskStatus } from "@/types";
import type { ProjectInput } from "./schema";

export const projectKeys = {
  all: (tenantId: string) => ["tenants", tenantId, "projects"] as const,
  list: (tenantId: string, search: string, status: string) =>
    [...projectKeys.all(tenantId), "list", { search, status }] as const,
  detail: (tenantId: string, projectId: string) =>
    [...projectKeys.all(tenantId), "detail", projectId] as const,
};

const authHeaders = (tenantId: string, role: Role | undefined) => ({
  "x-tenant-id": tenantId,
  "x-user-role": role ?? "",
});

export const getProjects = (tenantId: string, role: Role | undefined, search = "", status = "all") =>
  apiClient<ApiResponse<Project[]>>(
    `/api/projects?tenantId=${tenantId}&search=${encodeURIComponent(search)}&status=${status}`,
    { headers: authHeaders(tenantId, role) },
  );

export const getProject = (tenantId: string, role: Role | undefined, projectId: string) =>
  apiClient<ApiResponse<Project>>(`/api/projects/${projectId}?tenantId=${tenantId}`, {
    headers: authHeaders(tenantId, role),
  });

export const createProject = (tenantId: string, role: Role | undefined, input: ProjectInput) =>
  apiClient<ApiResponse<Project>>("/api/projects", {
    method: "POST",
    headers: authHeaders(tenantId, role),
    body: JSON.stringify({ tenantId, ...input }),
  });

export const updateTaskStatus = (tenantId: string, role: Role | undefined, projectId: string, taskId: string, status: TaskStatus) =>
  apiClient(`/api/projects/${projectId}?tenantId=${tenantId}`, {
    method: "PATCH",
    headers: authHeaders(tenantId, role),
    body: JSON.stringify({ taskId, status }),
  });
