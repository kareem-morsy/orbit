import type { Project, Tenant } from "@/types";

export const tenants: Tenant[] = [
  { id: "acme", name: "Acme Studio", plan: "Business" },
  { id: "nova", name: "Nova Labs", plan: "Starter" },
];

export const projects: Project[] = [
  {
    id: "p-101", tenantId: "acme", name: "Mobile App Redesign",
    description: "Rebuild the mobile experience around the new product strategy.",
    status: "active", progress: 68, members: 6, dueDate: "2026-08-18",
    tasks: [
      { id: "t-1", projectId: "p-101", title: "Finalize onboarding flow", status: "in_progress", priority: "high", assignee: "Mona Ali", dueDate: "2026-08-02" },
      { id: "t-2", projectId: "p-101", title: "Audit design tokens", status: "todo", priority: "medium", assignee: "Kareem Morsy", dueDate: "2026-08-04" },
      { id: "t-3", projectId: "p-101", title: "Ship analytics events", status: "done", priority: "low", assignee: "Omar Nabil", dueDate: "2026-07-25" }
    ]
  },
  {
    id: "p-102", tenantId: "acme", name: "Growth Experiments",
    description: "Conversion-focused experiments for the acquisition funnel.",
    status: "planning", progress: 24, members: 4, dueDate: "2026-09-05",
    tasks: [
      { id: "t-4", projectId: "p-102", title: "Define experiment backlog", status: "todo", priority: "high", assignee: "Sara Adel", dueDate: "2026-08-08" }
    ]
  },
  {
    id: "p-103", tenantId: "acme", name: "API Documentation",
    description: "Developer portal and public integration guides.",
    status: "completed", progress: 100, members: 3, dueDate: "2026-07-12", tasks: []
  },
  {
    id: "p-201", tenantId: "nova", name: "Marketing Website",
    description: "New launch website for Nova Labs.",
    status: "active", progress: 42, members: 3, dueDate: "2026-08-29",
    tasks: [
      { id: "t-5", projectId: "p-201", title: "Build hero section", status: "in_progress", priority: "high", assignee: "Kareem Morsy", dueDate: "2026-08-03" }
    ]
  }
];

export const delay = (ms = 450) => new Promise((resolve) => setTimeout(resolve, ms));
