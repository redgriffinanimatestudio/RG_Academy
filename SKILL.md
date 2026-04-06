---
name: RG_Academy_Ecosystem
description: Industrial Onboarding, Path Selection, and Strategic Step-by-Step Development for the Red Griffin Academy.
---

# RG Academy Ecosystem Skill

This skill provides the architectural logic and operational protocols for the **RG Academy Ecosystem**, ensuring high-fidelity user journeys and industrial-grade quality.

## When to use
Use this skill for ANY task involving the RG Academy codebase. It integrates best practices from Vercel React, Playwright Testing, and Frontend Design.

## 🛡️ Security-First Protocol
1. **Route Guarding**: Never allow `PENDING` users access to internal tools. Redirect to `/dashboard/welcome-waitlist`.
2. **Identity Verification**: Always check `user.registrationStatus` from `AuthContext`.
3. **Data Integrity**: All registration/onboarding inputs must include `selectedPath` and `metadata` for synchronization.

## 🚀 Step-by-Step Development (Roadmap)
Follow the **Red Griffin Synchronization Lifecycle**:
- **PHASE 1 (Core Identity)**: Database schema, Enums, and Auth API stabilization. [DONE]
- **PHASE 2 (Pathfinder UI)**: HeroPathfinder, ComplianceCenter, and Journey persistence. [DONE]
- **PHASE 3 (Routing & Guarding)**: RouteGuard implementation and sector redirection. [CURRENT]
- **PHASE 4 (Industrial Testing)**: E2E Playwright coverage for registration and sector-specific dashboards.
- **PHASE 5 (Beta Optimization)**: Vercel performance rules implementation (Eliminating waterfalls).

## 🧪 Industrial Testing Protocol (via webapp-testing)
1. **Recon-Then-Action**: Before automating, always inspect the rendered DOM and take screenshots.
2. **Headless Chrome**: Use `sync_playwright()` for all local verification scripts.
3. **Network Idle**: Always wait for `networkidle` state before interacting with dynamic React components.

## 🎨 Design DNA (via frontend-design)
- Use `.glass-pro-max` for all modern panels.
- Prefer `.text-gradient-primary` for industrial headings.
- Avoid generic fonts; use "Outfit" for display and "Inter" for body as defined in `index.css`.

## ⚡ Performance Protocol (via vercel-react-best-practices)
- **async-parallel**: Use `Promise.all()` for simultaneous user/profile data fetching.
- **bundle-dynamic-imports**: Use `React.lazy` or `next/dynamic` for heavy sector modules.
- **rerender-memo**: Memoize expensive dashboard widgets and charts.

## 🧬 Neural Identity Protocol (UX)
1. **Horizontal Branching**: Always use left-to-right expansion (Desktop) to visualize role hierarchy and path evolution.
2. **Context Presence**: Sub-roles (Specializations) must be visible immediately (opacity < 0.6) to provide path foresight.
3. **Mobile Swipe**: Smartphones must implement horizontal `carousel-snap` with indicators for professional interaction.

## 🗄️ Industrial Prisma Protocol (DB)
1. **Explicit Adapters**: Starting from v7, always use `@prisma/adapter-*` (e.g., `@prisma/adapter-mysql`) for SQL providers.
2. **Dedicated Config**: Use `prisma.config.ts` for all database, migration, and environment loading logic.
3. **Client Isolation**: When using custom output paths, ensure all service imports point to the correct generated entrypoint.
4. **Lifecycle**: Always run `npx prisma generate` after schema changes to synchronize types and internal binaries.
