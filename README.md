<div align="center">
<img width="1200" height="475" alt="RG Academy Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# 🦅 Red Griffin Academy - AI-Controlled Ecosystem
### Industrial-Grade Creative Management Platform
</div>

---

## 🚀 Overview
**Red Griffin Academy** is a high-velocity, role-based ecosystem designed to bridge the gap between AI-assisted learning and industrial production. It provides a unified command center for students, lecturers, agencies, and studio executors.

## 🏗️ Architecture
The platform operates on a **Hybrid Architecture** (Frontend + Backend Sync):
- **Core**: Node.js/Express 4.21
- **Frontend**: React 19 + Vite 6 (Integrated Mode)
- **Database**: Prisma 6 + MySQL
- **AI Integration**: Google Gemini 1.5/2.0
- **Real-time**: Socket.io for live collaboration and telemetry

## 🔐 RBAC (Role-Based Access Control)
The system enforces strict access control across several specialized hubs:
- **Command Center**: Global platform administration.
- **HR Hub**: Talent and vacancy management.
- **Studio Hub**: Project execution and pipeline monitoring.
- **Finance Hub**: Ledger and transaction auditing.
- **Agency Hub**: Multi-user account management and reporting.

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+)
- MySQL Server

### Installation
1.  **Clone & Install**:
    ```bash
    npm install
    ```
2.  **Environment Setup**:
    Copy `.env.example` to `.env` and configure your credentials.
    ```bash
    cp .env.example .env
    ```
3.  **Database Migration**:
    ```bash
    npx prisma migrate dev
    ```
4.  **Launch Ecosystem**:
    ```bash
    npm run dev
    ```

## 📦 Deployment
Use the included industrial scripts for production prep:
- `ZIP_FOR_HOSTINGER.bat`: Packages the entire app for web hosting.
- `SYNC_CORE.bat`: Synchronizes core assets with the remote environment.

---
<div align="center">
© 2026 Red Griffin Academy. All Rights Reserved.
</div>
