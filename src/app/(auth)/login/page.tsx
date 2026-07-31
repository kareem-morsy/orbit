"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Layers3 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginInput } from "@/features/auth/schema";
import { useSessionStore } from "@/stores/session-store";

export default function LoginPage() {
  const router = useRouter();
  const login = useSessionStore((state) => state.login);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "admin@orbit.dev", password: "password", role: "admin" },
  });

  const onSubmit = async (values: LoginInput) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    login(values.email, values.role);
    router.push("/dashboard");
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_.9fr]">
      <section className="relative hidden overflow-hidden bg-[#11162b] p-14 text-white lg:flex lg:flex-col">
        <div className="absolute -right-32 -top-32 size-96 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="flex items-center gap-3 text-xl font-bold"><span className="grid size-10 place-items-center rounded-xl bg-brand-500">O</span>Orbit PM</div>
        <div className="my-auto max-w-xl">
          <span className="mb-5 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-brand-100">Built for focused teams</span>
          <h1 className="text-5xl font-semibold leading-tight">Move every project forward, without the chaos.</h1>
          <p className="mt-6 text-lg leading-8 text-slate-400">One workspace for projects, priorities, and the people doing the work.</p>
          <div className="mt-10 grid grid-cols-2 gap-4">
            {["Tenant-isolated data", "Role-aware experience"].map((item) => <div key={item} className="flex items-center gap-2 text-sm text-slate-300"><CheckCircle2 className="size-4 text-emerald-400" />{item}</div>)}
          </div>
        </div>
        <p className="text-xs text-slate-500">Interview task demo • Mock data only</p>
      </section>
      <section className="flex items-center justify-center bg-white p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden"><Layers3 className="size-9 text-brand-600" /></div>
          <p className="text-sm font-semibold text-brand-600">WELCOME BACK</p>
          <h2 className="mt-2 text-3xl font-semibold">Sign in to your workspace</h2>
          <p className="mt-2 text-sm text-slate-500">Use the pre-filled demo credentials.</p>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <div><label className="mb-2 block text-sm font-medium">Email address</label><input className="input" {...register("email")} /><p className="mt-1 text-xs text-red-600">{errors.email?.message}</p></div>
            <div><label className="mb-2 block text-sm font-medium">Password</label><input type="password" className="input" {...register("password")} /><p className="mt-1 text-xs text-red-600">{errors.password?.message}</p></div>
            <div><label className="mb-2 block text-sm font-medium">Demo role</label><select className="input" {...register("role")}><option value="admin">Admin — full access</option><option value="member">Member — restricted access</option></select></div>
            <button disabled={isSubmitting} className="btn-primary w-full">{isSubmitting ? "Signing in…" : "Sign in"}</button>
          </form>
        </div>
      </section>
    </div>
  );
}
