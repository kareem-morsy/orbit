export type Role = "admin" | "member";
export type ProjectStatus = "planning" | "active" | "completed";
export type TaskStatus = "todo" | "in_progress" | "done";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Tenant {
  id: string;
  name: string;
  plan: "Starter" | "Business";
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  status: TaskStatus;
  priority: "low" | "medium" | "high";
  assignee: string;
  dueDate: string;
}

export interface Project {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  members: number;
  dueDate: string;
  tasks: Task[];
}

export interface ApiResponse<T> {
  data: T;
  meta?: { page: number; limit: number; total: number; totalPages: number };
}
