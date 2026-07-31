"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role, User } from "@/types";

interface SessionState {
  user: User | null;
  tenantId: string;
  login: (email: string, role: Role) => void;
  logout: () => void;
  setTenant: (tenantId: string) => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      user: null,
      tenantId: "acme",
      login: (email, role) =>
        set({ user: { id: "u-1", name: "Kareem Morsy", email, role } }),
      logout: () => set({ user: null }),
      setTenant: (tenantId) => set({ tenantId }),
    }),
    { name: "orbit-session" },
  ),
);
