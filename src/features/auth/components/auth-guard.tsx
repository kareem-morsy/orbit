"use client";

import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSessionStore } from "@/stores/session-store";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useSessionStore((state) => state.user);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const finishHydration = () => setHydrated(true);

    if (useSessionStore.persist.hasHydrated()) finishHydration();
    const unsubscribe = useSessionStore.persist.onFinishHydration(finishHydration);

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (hydrated && !user) router.replace("/login");
  }, [hydrated, router, user]);

  if (!hydrated || !user) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50">
        <div className="text-center">
          <LoaderCircle className="mx-auto size-7 animate-spin text-brand-600" />
          <p className="mt-3 text-sm text-slate-500">Checking your session…</p>
        </div>
      </div>
    );
  }

  return children;
}
