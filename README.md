# Orbit PM

A deliberately scoped multi-tenant project-management demo for a frontend interview task. It proves the architecture and state-management decisions without pretending to rebuild Jira in a week.

## Stack

- Next.js 15 App Router + React 19 + TypeScript
- Tailwind CSS 4
- TanStack React Query for server state
- Zustand for persisted session, role, and active tenant
- React Hook Form + Zod for forms and request validation
- Next.js Route Handlers as a mock backend

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000/login`.

## Demo credentials

The mock backend doesn't validate a real password — any email/password combination works. What matters is the **role** you pick on the login form:

| Field | Value |
| --- | --- |
| Email | any value, e.g. `you@orbit.dev` |
| Password | any value, 6+ characters |
| Role | `Admin` or `Member` |

- **Admin** — can create projects, change task status, and view `/team`.
- **Member** — read-only task board, sees the 403 state on `/team`.

## Available scripts

```bash
npm run dev         # start the dev server
npm run build        # production build
npm run start        # run the production build locally
npm run lint          # ESLint
npm run typecheck   # tsc --noEmit
```

No automated tests are included in this submission — see **Scope and trade-offs** below for why, and what a real test suite would cover first.

## Architecture

```text
src/
├── app/                 # Routes, layouts and mock Route Handlers
├── components/          # Shared UI and layout primitives
├── features/            # Domain-owned API, schemas and components
├── lib/                 # API client, QueryClient and mock database
├── stores/              # Global client state only
└── types/               # Cross-domain contracts
```

React Query owns all data that comes from HTTP. Zustand only owns client/session state. Tenant identity is part of every project query key:

```ts
["tenants", tenantId, "projects", "list", filters]
```

This prevents cached Acme data from appearing inside Nova after switching workspaces.

## Mock backend

Implemented endpoints:

| Method | Endpoint | Behavior |
| --- | --- | --- |
| GET | `/api/tenants` | Returns available workspaces |
| GET | `/api/projects` | Tenant isolation, search, status filter and pagination |
| POST | `/api/projects` | Zod-validated project creation |
| GET | `/api/projects/:id` | Project with tasks |
| PATCH | `/api/projects/:id` | Zod-validated task status update |

The project routes require mock role and tenant headers. Read operations verify that the requested tenant matches the active session context. Mutations additionally require the `admin` role, and project detail/update lookups are scoped by both `projectId` and `tenantId`. The mock database is intentionally in memory, so data resets whenever the development server restarts. Artificial latency is included so loading states can be reviewed.

## Scope and trade-offs

Included: guarded dashboard routes, responsive mobile navigation, tenant switching, dashboard, project search/filter/create, project task board, frontend and mock-API role checks, cross-tenant isolation, 403, loading/error/empty states.

Excluded on purpose: automated tests, production authentication, database persistence, drag and drop, full notifications/settings/members CRUD, file uploads and real-time updates. Those features would add volume, not stronger evidence for this assignment.

The role and tenant headers are a deliberate mock-backend boundary, not production security: a real application would derive both values from a verified server-side session and membership records rather than trusting browser-supplied headers. Hiding a button or route in React remains UX, not security.

## Time constraints and what's not here

This is the part the available time allowed. A few specific trade-offs, and why:

- **Drag-and-drop.** Task status changes through a `<select>` instead. If I'd had more time I'd have used [`dnd-kit`](https://dndkit.com) — it's the actively maintained option for React (the older `react-beautiful-dnd` is deprecated) — and kept the `<select>` alongside it as the accessible fallback per the brief, rather than replacing it.
- **Only two roles (`admin`, `member`)** instead of the full five (Owner / Administrator / Project Manager / Team Member / Viewer). The permission-check pattern (`authorizeMockRequest`, role-gated UI) is built to extend — it's adding entries to the enum and the mock table, not new architecture — but wiring and testing five distinct permission sets needed more time than was available.
- **No real backend or design file.** Both had to be improvised — a mock API layer and UI decisions made on the fly — which took noticeably longer than working from an existing backend/design would have, and left less time for additional modules (Notifications, Settings, and Members are intentionally left as empty/read-only states rather than full CRUD).
- **No unit tests.** I'd planned to use Jest, but I haven't used it in depth before, and getting properly comfortable with it (rather than writing tests I only half-understood) was more time than this submission allowed. Given more time, the first tests I'd write are: the `authorizeMockRequest` guard, the tenant-scoped query-key factory, and an integration test for the login → switch tenant → view projects flow.

## Future improvements

- Add `dnd-kit`-based drag-and-drop for the task board, alongside the existing accessible `<select>` fallback.
- Extend `Role` to the full five-role set and drive UI/route/API checks off a single permission-matrix module instead of `role === "admin"` checks.
- Get comfortable with Jest and add the test layers noted above, plus Playwright coverage for the login → switch workspace → create task flow.
- Replace the `x-user-role` / `x-tenant-id` headers with a verified server session (e.g. httpOnly cookie + server-side lookup).
- Real-time task/notification updates via WebSocket or SSE, updating the React Query cache directly instead of full refetches.
- Persist the mock database (SQLite or a hosted Postgres) so state survives restarts and supports a deployed preview.
- Full CRUD for Notifications, Settings, and Members instead of the current read-only/empty states.

## A note on how this was built

This project was built with AI assistance (ChatGPT) under my direction, mainly to mock the backend layer and implement parts of the design and code. I set the architecture and scope decisions (tenant-aware query keys, the permission-check boundary, which parts to cut and why), reviewed the generated code, and made the trade-off calls documented above.
