"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, CheckCircle2, Clock3, FolderKanban, Plus } from "lucide-react";
import Link from "next/link";
import { ProjectCard } from "@/features/projects/components/project-card";
import { getProjects, projectKeys } from "@/features/projects/api";
import { useSessionStore } from "@/stores/session-store";

export default function DashboardPage() {
  const tenantId = useSessionStore((state) => state.tenantId);
  const user = useSessionStore((state) => state.user);
  const query = useQuery({ queryKey: projectKeys.list(tenantId, "", "all"), queryFn: () => getProjects(tenantId, user?.role) });
  const projects = query.data?.data ?? [];
  const totalTasks = projects.reduce((sum, project) => sum + project.tasks.length, 0);
  const completedTasks = projects.flatMap((project) => project.tasks).filter((task) => task.status === "done").length;
  const stats = [
    { label: "Active projects", value: projects.filter((p) => p.status === "active").length, icon: FolderKanban, color: "bg-blue-50 text-blue-600" },
    { label: "Open tasks", value: totalTasks - completedTasks, icon: Clock3, color: "bg-amber-50 text-amber-600" },
    { label: "Completed tasks", value: completedTasks, icon: CheckCircle2, color: "bg-emerald-50 text-emerald-600" },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm text-slate-500">Monday, July 27</p><h1 className="mt-1 text-3xl font-semibold">Good morning, {user?.name?.split(" ")[0] ?? "Kareem"}</h1><p className="mt-2 text-sm text-slate-500">Here’s what’s happening across your workspace.</p></div><Link href="/projects" className="btn-primary"><Plus className="size-4" />View projects</Link></div>
      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {stats.map(({ label, value, icon: Icon, color }) => <div key={label} className="panel flex items-center gap-4 p-5"><div className={`grid size-12 place-items-center rounded-xl ${color}`}><Icon className="size-5" /></div><div><p className="text-2xl font-semibold">{query.isLoading ? "—" : value}</p><p className="text-sm text-slate-500">{label}</p></div></div>)}
      </section>
      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between"><div><h2 className="text-lg font-semibold">Priority projects</h2><p className="text-sm text-slate-500">Projects that need your attention</p></div><Link href="/projects" className="flex items-center gap-1 text-sm font-semibold text-brand-600">View all <ArrowUpRight className="size-4" /></Link></div>
        {query.isLoading ? <div className="grid gap-4 lg:grid-cols-3">{[1,2,3].map((i) => <div key={i} className="panel h-64 p-5"><div className="skeleton h-full" /></div>)}</div> : query.isError ? <ErrorState retry={() => query.refetch()} /> : <div className="grid gap-4 lg:grid-cols-3">{projects.slice(0, 3).map((project) => <ProjectCard key={project.id} project={project} />)}</div>}
      </section>
    </div>
  );
}

function ErrorState({ retry }: { retry: () => void }) {
  return <div className="panel p-8 text-center"><p className="font-semibold">Couldn’t load your workspace</p><p className="mt-1 text-sm text-slate-500">The mock API returned an error.</p><button className="btn-secondary mt-4" onClick={retry}>Try again</button></div>;
}
