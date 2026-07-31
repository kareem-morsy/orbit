import type { ProjectStatus, TaskStatus } from "@/types";

const styles = {
  active: "bg-emerald-50 text-emerald-700",
  planning: "bg-amber-50 text-amber-700",
  completed: "bg-blue-50 text-blue-700",
  todo: "bg-slate-100 text-slate-600",
  in_progress: "bg-violet-50 text-violet-700",
  done: "bg-emerald-50 text-emerald-700",
};

export function StatusBadge({ status }: { status: ProjectStatus | TaskStatus }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}>{status.replace("_", " ")}</span>;
}
