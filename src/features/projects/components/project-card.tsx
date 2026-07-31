import { ArrowUpRight, CalendarDays, Users } from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";
import type { Project } from "@/types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.id}`} className="panel group block p-5 transition hover:-translate-y-0.5 hover:border-brand-100 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <StatusBadge status={project.status} />
        <ArrowUpRight className="size-4 text-slate-400 transition group-hover:text-brand-600" />
      </div>
      <h3 className="mt-5 text-lg font-semibold">{project.name}</h3>
      <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">{project.description}</p>
      <div className="mt-6">
        <div className="mb-2 flex justify-between text-xs"><span className="text-slate-500">Progress</span><span className="font-semibold">{project.progress}%</span></div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-brand-500" style={{ width: `${project.progress}%` }} /></div>
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
        <span className="flex items-center gap-1.5"><Users className="size-3.5" />{project.members} members</span>
        <span className="flex items-center gap-1.5"><CalendarDays className="size-3.5" />{new Date(project.dueDate).toLocaleDateString("en", { month: "short", day: "numeric" })}</span>
      </div>
    </Link>
  );
}
