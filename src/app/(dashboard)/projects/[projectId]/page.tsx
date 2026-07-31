"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, CalendarDays, CircleAlert, Users } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { StatusBadge } from "@/components/ui/status-badge";
import { getProject, projectKeys, updateTaskStatus } from "@/features/projects/api";
import { useSessionStore } from "@/stores/session-store";
import type { TaskStatus } from "@/types";

const columns: { id: TaskStatus; title: string }[] = [
  { id: "todo", title: "To do" },
  { id: "in_progress", title: "In progress" },
  { id: "done", title: "Done" },
];

export default function ProjectDetailsPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const tenantId = useSessionStore((state) => state.tenantId);
  const role = useSessionStore((state) => state.user?.role);
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: projectKeys.detail(tenantId, projectId), queryFn: () => getProject(tenantId, role, projectId) });
  const mutation = useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: TaskStatus }) => updateTaskStatus(tenantId, role, projectId, taskId, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: projectKeys.detail(tenantId, projectId) }),
  });

  if (query.isLoading) return <div className="mx-auto max-w-7xl"><div className="skeleton h-9 w-72" /><div className="skeleton mt-8 h-96" /></div>;
  if (query.isError || !query.data) return <div className="panel mx-auto max-w-xl p-10 text-center"><CircleAlert className="mx-auto size-8 text-red-500" /><h1 className="mt-4 text-xl font-semibold">Project not found</h1><Link className="btn-secondary mt-5" href="/projects">Back to projects</Link></div>;
  const project = query.data.data;

  return (
    <div className="mx-auto max-w-7xl">
      <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600"><ArrowLeft className="size-4" />Back to projects</Link>
      <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
        <div><div className="flex items-center gap-3"><h1 className="text-3xl font-semibold">{project.name}</h1><StatusBadge status={project.status} /></div><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{project.description}</p></div>
        <div className="flex gap-3 text-sm text-slate-500"><span className="btn-secondary"><Users className="size-4" />{project.members} members</span><span className="btn-secondary"><CalendarDays className="size-4" />{project.dueDate}</span></div>
      </div>
      <div className="panel mt-8 p-5"><div className="flex justify-between text-sm"><span className="font-medium">Overall progress</span><strong>{project.progress}%</strong></div><div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-brand-500" style={{ width: `${project.progress}%` }} /></div></div>
      <div className="mt-8 flex items-end justify-between"><div><h2 className="text-xl font-semibold">Task board</h2><p className="mt-1 text-sm text-slate-500">Change a task status from its card. No drag and drop.</p></div>{role === "member" && <span className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">Read-only for members</span>}</div>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {columns.map((column) => {
          const tasks = project.tasks.filter((task) => task.status === column.id);
          return <section key={column.id} className="rounded-2xl bg-slate-100/70 p-3"><div className="flex items-center justify-between px-1 py-2"><h3 className="text-sm font-semibold">{column.title}</h3><span className="grid size-6 place-items-center rounded-full bg-white text-xs text-slate-500">{tasks.length}</span></div><div className="mt-2 space-y-3">{tasks.length ? tasks.map((task) => <article key={task.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-start justify-between gap-3"><h4 className="text-sm font-semibold leading-5">{task.title}</h4><span className={`mt-1 size-2 shrink-0 rounded-full ${task.priority === "high" ? "bg-red-500" : task.priority === "medium" ? "bg-amber-500" : "bg-emerald-500"}`} /></div><p className="mt-4 text-xs text-slate-500">{task.assignee}</p><div className="mt-4 border-t border-slate-100 pt-3"><select aria-label={`Status for ${task.title}`} disabled={role !== "admin" || mutation.isPending} value={task.status} onChange={(event) => mutation.mutate({ taskId: task.id, status: event.target.value as TaskStatus })} className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs outline-none"><option value="todo">To do</option><option value="in_progress">In progress</option><option value="done">Done</option></select></div></article>) : <div className="rounded-xl border border-dashed border-slate-300 p-7 text-center text-xs text-slate-400">No tasks here</div>}</div></section>;
        })}
      </div>
    </div>
  );
}
