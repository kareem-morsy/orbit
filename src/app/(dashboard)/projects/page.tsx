"use client";

import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useState } from "react";
import { getProjects, projectKeys } from "@/features/projects/api";
import { CreateProjectDialog } from "@/features/projects/components/create-project-dialog";
import { ProjectCard } from "@/features/projects/components/project-card";
import { useSessionStore } from "@/stores/session-store";

export default function ProjectsPage() {
  const tenantId = useSessionStore((state) => state.tenantId);
  const role = useSessionStore((state) => state.user?.role);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const query = useQuery({ queryKey: projectKeys.list(tenantId, search, status), queryFn: () => getProjects(tenantId, role, search, status) });

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-3xl font-semibold">Projects</h1><p className="mt-2 text-sm text-slate-500">Plan, track, and deliver work across your team.</p></div><CreateProjectDialog /></div>
      <div className="panel mt-8 flex flex-col gap-3 p-3 sm:flex-row">
        <label className="relative flex-1"><Search className="absolute left-3 top-3 size-4 text-slate-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-9" placeholder="Search projects…" /></label>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="input sm:w-44"><option value="all">All statuses</option><option value="planning">Planning</option><option value="active">Active</option><option value="completed">Completed</option></select>
      </div>
      <p className="mt-5 text-sm text-slate-500">{query.data?.meta?.total ?? 0} projects</p>
      {query.isLoading ? <div className="mt-4 grid gap-4 lg:grid-cols-3">{[1,2,3].map((i) => <div key={i} className="skeleton h-64" />)}</div> : query.data?.data.length ? <div className="mt-4 grid gap-4 lg:grid-cols-3">{query.data.data.map((project) => <ProjectCard key={project.id} project={project} />)}</div> : <div className="panel mt-4 p-12 text-center"><FolderEmpty /><h2 className="mt-4 font-semibold">No projects found</h2><p className="mt-1 text-sm text-slate-500">Try changing your search or filters.</p></div>}
    </div>
  );
}

function FolderEmpty() { return <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-slate-100 text-2xl">⌕</div>; }
