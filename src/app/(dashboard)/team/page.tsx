"use client";

import { LockKeyhole } from "lucide-react";
import Link from "next/link";
import { useSessionStore } from "@/stores/session-store";

export default function TeamPage() {
  const role = useSessionStore((state) => state.user?.role);
  if (role !== "admin") return <Unauthorized />;
  const people = [
    ["Kareem Morsy", "kareem@orbit.dev", "Admin"],
    ["Mona Ali", "mona@orbit.dev", "Member"],
    ["Omar Nabil", "omar@orbit.dev", "Member"],
  ];
  return <div className="mx-auto max-w-5xl"><h1 className="text-3xl font-semibold">Team</h1><p className="mt-2 text-sm text-slate-500">This route demonstrates role-based UI access.</p><div className="panel mt-8 overflow-hidden">{people.map(([name,email,roleName], index) => <div key={email} className={`flex items-center justify-between p-5 ${index ? "border-t border-slate-100" : ""}`}><div className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">{name.slice(0,2)}</div><div><p className="text-sm font-semibold">{name}</p><p className="text-xs text-slate-500">{email}</p></div></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">{roleName}</span></div>)}</div></div>;
}

function Unauthorized() {
  return <div className="panel mx-auto mt-16 max-w-lg p-10 text-center"><div className="mx-auto grid size-14 place-items-center rounded-2xl bg-red-50 text-red-600"><LockKeyhole className="size-6" /></div><p className="mt-5 text-sm font-semibold text-red-600">403 — ACCESS DENIED</p><h1 className="mt-2 text-2xl font-semibold">You don’t have permission</h1><p className="mt-2 text-sm leading-6 text-slate-500">Team management is restricted to workspace administrators.</p><Link href="/dashboard" className="btn-primary mt-6">Return to overview</Link></div>;
}
