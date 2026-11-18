# HuboVerse — AI-Powered HubSpot Learning, Automation & Operations SaaS

Developed for **HuboExperts**  
**Core AI Assistant:** Anna AI (Chat Mode & Build Mode)  
**Backend:** Supabase (PostgreSQL, Auth, RLS, Storage, pgvector) + NestJS Enterprise Gateway  
**Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui

---

## 1. System Applications & Ports

| Application | Path | Port | Purpose |
| :--- | :--- | :--- | :--- |
| **Public Website** | `apps/web` | `3000` | Landing page, academy showcase, Anna AI overview, pricing |
| **Client Workspace** | `apps/app` | `3001` | Multi-tenant client portal, Anna Chat/Build, courses, LiveKit |
| **Staff Admin** | `apps/admin` | `3002` | HuboExperts operations, cross-org telemetry, course scheduling |
| **Enterprise API** | `apps/api` | `4000` | NestJS OpenAPI gateway, HubSpot webhooks, Anna orchestration |

---

## 2. Core Architecture Packages

- **`packages/types`**: Shared domain models (multi-tenancy, RBAC roles, Anna Chat/Build, HubSpot capabilities).
- **`packages/hubspot-sdk`**: HubSpot Action Capability Registry, tier-weight validator, and AES-256-GCM token encryption.
- **`packages/ai-agent`**: LangGraph.js Anna engine, RAG hybrid search pipeline, and 4-stage safe execution state machine.
- **`packages/database`**: Supabase client factories, mock state, and SQL migrations with Row Level Security (RLS) & pgvector.

---

## 3. Anna AI — Two Distinct Modes

1. **Anna Chat Mode**: Conversational advisory intelligence grounded in HubSpot documentation, HuboVerse academy transcripts, and connected portal schemas via pgvector hybrid search.
2. **Anna Build Mode**: 4-stage safe execution pipeline:
   - *Stage 1*: Intent extraction.
   - *Stage 2*: Capability Registry & Scope Verification against HubSpot tiers (Free / Starter / Pro / Enterprise).
   - *Stage 3*: Dry-run and structural JSON schema diff generation.
   - *Stage 4*: Human-in-the-loop approval, atomic execution, and automatic rollback snapshots.

---

## 4. Getting Started

### Prerequisites
- Node.js >= 20
- pnpm >= 10

### Installation
```bash
pnpm install
```

### Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### Run All Applications in Development Mode
```bash
pnpm dev
```
- Public Web: `http://localhost:3000`
- Client Portal: `http://localhost:3001`
- Admin Operations: `http://localhost:3002`
- API Gateway & Swagger Docs: `http://localhost:4000/api/docs`
