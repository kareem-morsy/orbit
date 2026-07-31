"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { createProject, projectKeys } from "@/features/projects/api";
import { projectSchema, type ProjectInput } from "@/features/projects/schema";
import { useSessionStore } from "@/stores/session-store";

export function CreateProjectDialog() {
  const [open, setOpen] = useState(false);
  const tenantId = useSessionStore((state) => state.tenantId);
  const role = useSessionStore((state) => state.user?.role);
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: { status: "planning" },
  });
  const mutation = useMutation({
    mutationFn: (values: ProjectInput) => createProject(tenantId, role, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all(tenantId) });
      reset(); setOpen(false);
    },
  });

  if (role !== "admin") return null;
  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-primary"><Plus className="size-4" />New project</button>
      {open && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4 backdrop-blur-sm">
          <form onSubmit={handleSubmit((values) => mutation.mutate(values))} className="panel w-full max-w-lg p-6">
            <div className="flex items-start justify-between"><div><h2 className="text-xl font-semibold">Create project</h2><p className="mt-1 text-sm text-slate-500">Add a project to the current workspace.</p></div><button type="button" onClick={() => setOpen(false)} className="grid size-9 place-items-center rounded-lg hover:bg-slate-100"><X className="size-4" /></button></div>
            <div className="mt-6 space-y-4">
              <Field label="Project name" error={errors.name?.message}><input className="input" placeholder="e.g. Mobile app redesign" {...register("name")} /></Field>
              <Field label="Description" error={errors.description?.message}><textarea className="input min-h-24 py-3" placeholder="What is this project trying to achieve?" {...register("description")} /></Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Status" error={errors.status?.message}><select className="input" {...register("status")}><option value="planning">Planning</option><option value="active">Active</option><option value="completed">Completed</option></select></Field>
                <Field label="Due date" error={errors.dueDate?.message}><input type="date" className="input" {...register("dueDate")} /></Field>
              </div>
              {mutation.isError && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{mutation.error.message}</p>}
            </div>
            <div className="mt-7 flex justify-end gap-3"><button type="button" className="btn-secondary" onClick={() => setOpen(false)}>Cancel</button><button disabled={mutation.isPending} className="btn-primary">{mutation.isPending ? "Creating…" : "Create project"}</button></div>
          </form>
        </div>
      )}
    </>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-sm font-medium">{label}</span>{children}{error && <span className="mt-1 block text-xs text-red-600">{error}</span>}</label>;
}
