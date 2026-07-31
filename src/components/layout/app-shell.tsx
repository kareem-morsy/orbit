"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, Bell, BriefcaseBusiness, ChevronsUpDown, LogOut, Menu, Settings, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSessionStore } from "@/stores/session-store";

const navigation = [
  { href: "/dashboard", label: "Overview", icon: BarChart3 },
  { href: "/projects", label: "Projects", icon: BriefcaseBusiness },
  { href: "/team", label: "Team", icon: Users },
  { href: "/notifications", label: "Notifications", icon: Bell },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, tenantId, setTenant, logout } = useSessionStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => setMobileOpen(false), [pathname]);

  const signOut = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="hidden border-r border-slate-200 bg-[#101426] text-white lg:flex lg:flex-col">
        <div className="flex h-20 items-center gap-3 px-6">
          <div className="grid size-10 place-items-center rounded-xl bg-brand-500 font-bold">O</div>
          <div><p className="font-semibold">Orbit PM</p><p className="text-xs text-slate-400">Project workspace</p></div>
        </div>
        <div className="mx-4 mb-6 rounded-xl border border-white/10 bg-white/5 p-3">
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-slate-400">Workspace</label>
          <div className="flex items-center gap-2">
            <select
              aria-label="Current workspace"
              value={tenantId}
              onChange={(event) => setTenant(event.target.value)}
              className="min-w-0 flex-1 appearance-none bg-transparent text-sm font-medium outline-none"
            >
              <option className="text-slate-900" value="acme">Acme Studio</option>
              <option className="text-slate-900" value="nova">Nova Labs</option>
            </select>
            <ChevronsUpDown className="size-4 text-slate-400" />
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {navigation.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link key={href} href={href} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${active ? "bg-brand-500 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}>
                <Icon className="size-4" />{label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-3">
          <Link href="/settings" className="mb-2 flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-400 hover:bg-white/5"><Settings className="size-4" />Settings</Link>
          <button onClick={signOut} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-slate-400 hover:bg-white/5"><LogOut className="size-4" />Sign out</button>
        </div>
      </aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button aria-label="Close navigation" className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative flex h-full w-[min(84vw,320px)] flex-col bg-[#101426] text-white shadow-2xl">
            <div className="flex h-20 items-center justify-between px-5">
              <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-brand-500 font-bold">O</span><div><p className="font-semibold">Orbit PM</p><p className="text-xs text-slate-400">Project workspace</p></div></div>
              <button aria-label="Close navigation" onClick={() => setMobileOpen(false)} className="grid size-10 place-items-center rounded-xl text-slate-400 hover:bg-white/10 hover:text-white"><X className="size-5" /></button>
            </div>
            <div className="mx-4 mb-6 rounded-xl border border-white/10 bg-white/5 p-3">
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-slate-400">Workspace</label>
              <div className="flex items-center gap-2">
                <select aria-label="Current workspace" value={tenantId} onChange={(event) => setTenant(event.target.value)} className="min-w-0 flex-1 appearance-none bg-transparent text-sm font-medium outline-none">
                  <option className="text-slate-900" value="acme">Acme Studio</option>
                  <option className="text-slate-900" value="nova">Nova Labs</option>
                </select>
                <ChevronsUpDown className="size-4 text-slate-400" />
              </div>
            </div>
            <nav className="flex-1 space-y-1 px-3">
              {navigation.map(({ href, label, icon: Icon }) => {
                const active = pathname === href || pathname.startsWith(`${href}/`);
                return <Link key={href} href={href} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${active ? "bg-brand-500 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}><Icon className="size-4" />{label}</Link>;
              })}
            </nav>
            <div className="border-t border-white/10 p-3">
              <Link href="/settings" className="mb-2 flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-400 hover:bg-white/5"><Settings className="size-4" />Settings</Link>
              <button onClick={signOut} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-slate-400 hover:bg-white/5"><LogOut className="size-4" />Sign out</button>
            </div>
          </aside>
        </div>
      )}
      <div className="min-w-0">
        <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-5 lg:px-8">
          <div className="flex items-center gap-3 lg:hidden">
            <button aria-label="Open navigation" onClick={() => setMobileOpen(true)} className="grid size-10 place-items-center rounded-xl border border-slate-200 text-slate-700"><Menu className="size-5" /></button>
            <span className="font-bold text-brand-600">Orbit PM</span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button className="grid size-10 place-items-center rounded-xl border border-slate-200"><Bell className="size-4" /></button>
            <div className="grid size-10 place-items-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">{user?.name?.slice(0, 2).toUpperCase() ?? "KM"}</div>
            <div className="hidden sm:block"><p className="text-sm font-semibold">{user?.name ?? "Kareem Morsy"}</p><p className="text-xs capitalize text-slate-500">{user?.role ?? "admin"}</p></div>
          </div>
        </header>
        <main className="p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
