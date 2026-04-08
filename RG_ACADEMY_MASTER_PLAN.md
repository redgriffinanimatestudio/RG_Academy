# RG ACADEMY MASTER PLAN
## Udemy-like LMS Platform Development Roadmap
**Version: 1.1 | Updated: 2026-04-07 | Status: ACTIVE**

---

## 🏛️ ARCHITECTURAL STRATEGY (V2.0 Porting)
To achieve Coursera/Udemy standards, the interface is decoupled into three specialized modules:

1.  **LMS Core (Learning Management System):** 
    - Advanced Lesson Player with multi-format support.
    - Granular progress tracking and achievement triggers.
    - Dynamic assessment (Quizzes/Assignments) with real-time feedback.
2.  **Marketplace & Discovery:**
    - High-performance Catalog with SSR (Next.js/Vite SSR) for SEO.
    - Advanced filtering (Elasticsearch-like) and rich course previews.
    - Conversion-optimized Sales Funnels and Landing Pages.
3.  **Instructor Dashboard:**
    - "Industrial-grade" Course Builder (Drag-n-drop).
    - Sales & Student analytics with visual data (Recharts/D3).
    - Student management and communication hub.

---

## 🎨 UI/UX PRINCIPLES
- **Atomic Design:** Systematic development from Atoms → Molecules → Organisms → Templates → Pages.
- **Performance First:** Hybrid rendering (SSR for SEO-critical pages, CSR for interactive zones).
- **Accessibility (A11y):** WCAG 2.1 compliance, ARIA patterns, and keyboard navigation as a first-class citizen.
- **Modern Stack:** React 19 (Server Components ready) + Tailwind CSS 4 + FlyonUI (daisyUI v5 based).

---

## OVERVIEW
**Total Timeline: 18 weeks / ~4.5 months**
**Current Phase: 1 (LMS Core)**

---

## 🎯 PHASE 0: STABILIZATION & PLATFORM PREPARATION
**Duration: 1 week | Priority: CRITICAL | Status: 100% COMPLETE**

✅ **Done:**
- Fixed critical Dashboard syntax errors (LecturerDashboard.tsx)
- Fixed invalid Tailwind CSS `border-0.5` class
- Fixed StudentDashboard certificate naming mismatch
- Build now passes without critical errors

🔲 **Remaining:**
- Fix all TypeScript errors and warnings
- Add test coverage for Dashboard and core modules
- Implement unified API response format
- Optimize Prisma queries
- Setup proper error handling middleware
- Configure CI/CD pipeline
- Prepare staging environment
- Add Sentry logging and monitoring

**Success Metric:** Zero critical errors in production, build passes 100%

---

## 🎯 PHASE 1.0: INDUSTRIAL IDENTITY & DUAL-PATH INTEGRATION
**Duration: 2 weeks | Priority: CRITICAL | Status: IN_PROGRESS**

### Week 1: Professionalization & Logic
- 🔲 **Professional UX:** Complete migration of all "lore" terms to industry standards in i18n.
- 🔲 **Dual-Path Architecture:** Implement Side-by-Side selection for **Academy** (Education) and **Studio** (Industrial).
- 🔲 **Landing Logic:** Resolve Guest vs Auth states for `/aca`, `/studio`, and `/` routes.
- 🔲 **Compact Design:** Refactor registration and onboarding UI to use "Pro Max" (BMW/Linear) compact aesthetics.

### Week 2: Visual System Control (OmniCore)
- 🔲 **Visual Topology Prototype:** Implement a node-based graph of users/departments/projects in the Admin Dashboard.
- 🔲 **Real-time Interaction:** Allow admins to click nodes to inspect health, progress, and financial flows visually.
- 🔲 **Moltbook Inspiration:** Apply high-end node-graph animations and fluid layouts.

---

## 🎯 PHASE 1: LMS CORE & BASIC COURSE FUNCTIONALITY
**Duration: 3 weeks | Priority: HIGH | Status: IN_PROGRESS**

### Week 1: Course Editor & UX Foundations
- ✅ Drag-n-drop lesson/module constructor
- ✅ Support for video, text, PDF, presentations
- ✅ Built-in code editor with execution
- ✅ Course preview before publication
- 🔲 **EduAll UI Standard:** Implement high-conversion Course Details layout (based on BIBLE/EduAll)
- 🔲 **EduAll UI Standard:** Accordion-based curriculum navigation
### Week 2: Learning Progress & Interface
- ✅ Video viewing tracking (per-second precision) via `updateWatchTime`
- ✅ Automatic lesson completion detection (90% threshold logic)
- ✅ Course status system (not started/in progress/completed) via `getCourseStatus`
- ✅ Detailed completion percentage history via `getProgressHistory`
- ✅ Real-time progress updates via WebSockets (Socket.io)
- 🔲 **EduAll UI Standard:** Lesson Player with Sidebar Navigation and "Watch Next" queue

**Status: COMPLETE**
### Week 3: Assessment System
- 🔲 Quiz constructor with multiple question types
- 🔲 Automatic grading
- 🔲 Passing scores system
- 🔲 Retry limits and restrictions

**Dependencies:** Phase 0 100% complete
**Success Metric:** Instructor can create and publish full course in <15 minutes

---

## 🎯 PHASE 2: MONETIZATION & MARKETPLACE
**Duration: 3 weeks | Priority: HIGH | Status: PENDING**

### Week 1: Payment System & Pricing
- 🔲 Stripe/ЮKassa integration
- 🔲 One-time purchases
- 🔲 Monthly/annual subscriptions
- 🔲 **EduAll Standard:** Dual-mode (Monthly/Yearly) Pricing Packages with feature comparison
- 🔲 Coupons and promotional codes
- 🔲 Refunds and partial refunds

### Week 2: Course Marketplace
- 🔲 Search and filtering (categories, level, rating)
- 🔲 Ranking and recommendation engine
- 🔲 Course landing page with previews
- 🔲 Review and rating system

### Week 3: Instructor Revenue
- 🔲 Platform commission calculation
- 🔲 Instructor dashboard with analytics
- 🔲 Payout system to cards/wallets
- 🔲 Tax reporting and documentation

**Dependencies:** Phase 1 80% complete
**Success Metric:** User can find, purchase, and start course in <3 clicks

---

## 🎯 PHASE 3: INTERACTIVITY & GAMIFICATION
**Duration: 2 weeks | Priority: MEDIUM | Status: PENDING**

### Week 1: Achievement System
- 🔲 Badges and awards for activity
- 🔲 Levels and XP for course completion
- 🔲 Leaderboards and student rankings

### Week 2: Engagement Features
- 🔲 Video notes with timestamps
- 🔲 Bookmarks and favorites
- 🔲 "Watch later" lists
- 🔲 Playback speed control
- 🔲 Learning streaks and reminders

**Dependencies:** Phase 1 complete
**Success Metric:** Average session duration increases by 30%

---

## 🎯 PHASE 4: COMMUNITY & SOCIAL FEATURES
**Duration: 2 weeks | Priority: MEDIUM | Status: PENDING**

### Week 1: Q&A System
- 🔲 Per-course forums
- 🔲 Lesson-specific questions
- 🔲 Instructor/student answers
- 🔲 Vote system for best answers

### Week 2: Social Features
- 🔲 Public student/instructor profiles
- 🔲 Author subscriptions
- 🔲 Certificate sharing to social media
- 🔲 Direct messaging between users
- 🔲 Study groups and collaborative assignments

**Dependencies:** Phases 1 & 3 complete
**Success Metric:** >20% of students participate in discussions

---

## 🎯 PHASE 5: SCALING & ANALYTICS
**Duration: 3 weeks | Priority: MEDIUM | Status: PENDING**

### Week 1: Instructor Analytics
- 🔲 Conversion metrics dashboard
- 🔲 Lesson drop-off tracking
- 🔲 Feedback and review analysis
- 🔲 Course improvement recommendations

### Week 2: Administration
- 🔲 Content moderation tools
- 🔲 User management
- 🔲 Financial reporting
- 🔲 Fraud detection systems

### Week 3: Performance
- 🔲 CDN for video content
- 🔲 Query caching and optimization
- 🔲 Support for >10k concurrent users

**Dependencies:** All previous phases complete
**Success Metric:** Any page loads in <2 seconds at 10k users

---

## 🎯 PHASE 6: PREMIUM FEATURES & ECOSYSTEM
**Duration: 4 weeks | Priority: LOW | Status: PENDING**

### Week 1-2: Premium Features
- 🔲 Offline course viewing
- 🔲 Transcripts and subtitles
- 🔲 Calendar integration
- 🔲 Personal mentoring and 1-on-1 sessions

### Week 3: Integrations
- 🔲 Public API for third-party developers
- 🔲 Zoom/Google Meet webinar integration
- 🔲 Slack/Discord bots
- 🔲 CRM system integrations

### Week 4: Corporate Learning
- 🔲 Enterprise accounts
- 🔲 Team and group management
- 🔲 Corporate analytics
- 🔲 Custom white-label courses

**Dependencies:** All core phases complete and stable
**Success Metric:** >30% revenue from premium/corporate segments

---

## SUCCESS METRICS (MUST ACHIEVE)
- ✅ Visit-to-purchase conversion: >3%
- ✅ Course completion rate: >15%
- ✅ Average course rating: >4.5/5
- ✅ 7-day retention: >40%
- ✅ Net Promoter Score: >50

---

## KEY RISKS & MITIGATIONS
1. **Video infrastructure scaling** - Use Cloudflare Stream / Mux
2. **Content quality moderation** - Implement AI moderation + human review
3. **Competition** - Focus on niche (VFX/Technical Art) before general audience
4. **Compliance** - Implement GDPR/CCPA compliant data handling

---

## MAINTAINING THIS PLAN
When working on tasks:
1. Update status from PENDING → IN_PROGRESS when you start
2. Update to COMPLETE when finished
3. Add notes if you encounter blocking issues
4. Do not modify phase durations or priorities without confirmation

Last updated: 2026-04-06
Current owner: Kilo AI