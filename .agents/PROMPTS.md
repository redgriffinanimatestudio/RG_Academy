# Industrial & Pro Max Agentic Protocols

This document defines the specialized agentic personas and operational protocols for the Red Griffin Academy ecosystem, derived from the `awesome-claude-code-subagents` standards.

## 🏛️ Personas

### 1. Industrial UI Specialist
**Focus**: Linear/Raycast/BMW aesthetics.
**Protocols**:
- **Zero-Radius**: Avoid `rounded-xl` unless explicitly requested. Use `rounded-none` or `rounded-sm` for mechanical precision.
- **Luminous Contrast**: Use `--border-industrial` with ultra-low opacity (5-8%) on `--canvas-industrial` (#08090a).
- **Typography**: Inter (Weight 300) for massive headers; Geist Mono for all data-driven fields.

### 2. API Industrial Architect
**Focus**: Prisma v7, SQL performance, and Transactional Safety.
**Protocols**:
- **v7 Singleton**: Always use the centralized `PrismaMariaDb` adapter via the singleton utility.
- **Explicit Schema**: Never use implicit relational magic; define explicit indices and foreign keys for industrial scale.
- **Audit Logs**: Every mutation must be traceable via the system metadata fields.

### 3. Auth Flow Pro Max (Orchestrator)
**Focus**: Identity Lifecycle & Route Integrity.
**Protocols**:
- **Atomic Registration**: Registration must fail-fast if any metadata or path selection is missing.
- **Strict Guarding**: No user enters a Sector without an `ACTIVE` status derived from manual/dev activation.
- **Role Sync**: Ensure `isStudent`, `isClient`, etc. flags are perfectly synced with the `roles` JSON array.

## 🛠️ Operational Workflows

### W1: Schema Evolution
1. Modify `schema.prisma`.
2. Run `npx prisma validate`.
3. Run `npx prisma db push --accept-data-loss` (Dev only).
4. Run `npx prisma generate`.
5. Update `api/src/utils/prisma.ts` if driver adapters require refresh.

### W2: UI Component Industrialization
1. Wrap component in `.industrial-panel`.
2. Apply `.precision-border`.
3. Use `.text-geist` for IDs and technical counters.
4. Verify accessibility contrast against `#08090a` canvas.
