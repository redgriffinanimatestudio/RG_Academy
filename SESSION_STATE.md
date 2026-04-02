# Red Griffin Academy - Session State (v2.31)

This document encapsulates the current state of the project to facilitate a 'clean' conversation handshake and resolve performance issues.

## 🚀 Current Architecture State (v2.30)
We have successfully transitioned the registration ecosystem from a monolithic structure to a **modular, high-fidelity component-service architecture**.

### 1. Frontend Registration Shards (`src/components/auth/registration/`)
- **Orchestrator**: `Login.tsx` (reduced from 810 to 472 lines).
- **Shards**:
  - `IdentitySidebar.tsx`: Persistent role lineage tracker.
  - `RegStep1Role.tsx` through `RegStep5Legal.tsx`: Atomic lifecycle steps.
  - `RegSuccess.tsx`: Cinematic success and redirection.

### 2. Backend Identity Service (`api/src/services/identityService.ts`)
- **Functionality**: Encapsulates all complex Prisma transactions for registration, social synchronization, and onboarding.
- **Controller**: `authController.ts` acts as a slim entry-point delegating to the service layer.

### 3. Legal & Compliance
- **Status**: Every registered node now generates a legally compliant `UserDocument` with a digital signature hash.
- **Social Sync**: GitHub/Google logins with missing profile data are correctly bridged into the 5-step registration grid.

## 🔧 Performance Hardening (v2.31)
- **Indexing Restricted**: `tsconfig.json` now only scans `src/` and `api/src/`.
- **VS Code Watcher**: `.vscode/settings.json` implemented to ignore `node_modules` and `dist` folders, freeing up CPU.
- **Gitignore Restore**: Build artifacts are now correctly ignored.

## 📌 Pending Milestones
1. **Production Synchronization**: Deploy the v2.30 sharded architecture to Hostinger.
2. **End-to-End Audit**: Verify social identity sharding in a production-identical environment.

**Chat context summary complete. We are operating in a lean, optimized workspace.**
