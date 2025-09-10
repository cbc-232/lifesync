# lifesync
🌍 LifeSync Project Vision & Full Build Summary

🧠 OVERVIEW
LifeSync is a healthcare-first platform, initially built for Sierra Leone, with ambitions to scale across underserved regions. It bridges the gap between patients, medical personnel, and hospitals using a mix of:

*   Smart scheduling
*   Role-based AI recommendations
*   Inclusive access via smartphones and non-smartphones (crucially, IVR/SMS)
*   Robust backend architecture
*   Progressive Web App (PWA) frontend
*   IVR (Interactive Voice Response) systems
*   Centralized healthcare appointment system

🏗️ ARCHITECTURE BREAKDOWN

🔹 BACKEND (Current Focus — High Progress)
✅ Core Stack:
*   Node.js, Express, TypeScript
*   Prisma ORM + SQLite (to be swappable with PostgreSQL later)
*   Modular structure (Controllers, Services, Routes, Middlewares)
*   Swagger + OpenAPI Docs
*   Jest for Unit Testing
*   Environment Config via .env

✅ Functionalities:
*   **User Management (Admin / Medical / Hospital / Patient):**
    *   User model with role enum: PATIENT, MEDICAL, ADMIN, HOSPITAL
    *   Role-based onboarding (handled manually or via invites)
*   **Patient Registration & Inquiry Intake:**
    *   `PatientService.ts`: Validates and stores district + address
    *   `InquiryService.ts`: For anonymous health concerns (non-smartphone users too)
*   **Appointments:**
    *   Role-aware logic:
        *   Patient: Books via phone or digital
        *   Guest: Inquiry/Emergency walk-ins
        *   Hospital: Assigns staff
    *   Appointment Status: PENDING, CONFIRMED, etc.
    *   Appointment Type: BOOKING, EMERGENCY, INQUIRY
*   **Authentication & Security (Implemented & Robust):**
    *   JWT-based login
    *   **Role-Based Access Control (RBAC) via `requireRole` middleware.**
    *   **Resource Ownership checking via `checkOwnership` middleware.**
    *   Password hashing via `bcrypt` (including password update functionality).
    *   Phone Validation & Location: All phone numbers must follow Sierra Leone format. Location required: dropdown district + string address. Utilities like `validatePhone.ts` for logic isolation.
*   **Swagger Docs:** Live docs from route annotations, hosted at `/api/docs`.

🔹 IVR SYSTEM (Phase 1B - High Priority)
*   **Strategic Importance:** This is the most critical channel for immediate and broad impact, serving users without smartphones or reliable internet.
*   **Goal:** Enable patients to call a number, navigate a menu (DTMF), and book appointments or report emergencies.
*   **Key Integration:** Requires a robust communications API (e.g., Twilio) for voice (IVR), SMS, and phone number management.
*   **Flow:**
    *   User calls LifeSync line.
    *   Hears: “Press 1 to book appointment, 2 for emergency, 3 for inquiry…”
    *   Flow branches into: Info collection via keypad, Location detection, Emergency auto-alert to hospital system, Recorded messages stored with metadata.

🔹 AI Recommendation System (Phase 2 - Refined Scope)
*   **Strategic Goal:** Focus on triage, routing, and providing pre-approved, safe health information. Avoid direct diagnosis suggestions due to medical and legal risks.
*   **For Patients:** Use AI to understand SMS/IVR inquiries to suggest "Emergency" vs. "Booking" vs. "Health Question" and provide trusted health information.
*   **For Admins:** Optimize schedules and resource allocation based on incoming appointment types.
*   **Driven by:** OpenAI API or compatible foundation models (OpenRouter, Claude, Mistral, etc.).
*   **Fallback Logic:** If AI fails, deliver generic but safe response.

🔹 FRONTEND (Phase 3 - To Be Started)
✅ Stack Vision:
*   React + TypeScript
*   Tailwind CSS
*   React Router / Redux
*   Service Workers for PWA
*   Push Notifications (Firebase or custom)
✅ Features:
*   Multi-role Dashboards: Patients (appointments, recommendations), Hospitals (view/assign appointments), Admin (manage staff and users).
*   PWA Functionality: Offline fallback, Installable app icon, Sync when back online.
*   Mobile-first UI: Optimized for underserved devices, Responsive, low-data usage.
*   Non-smartphone users: SMS fallback for updates, Access via IVR and hospital kiosk.

📂 DIRECTORY STRUCTURE (Clean Architecture)
```bash
lifesync-backend/
├── src/
│   ├── controllers/
│   ├── services/
│   ├── middlewares/
│   ├── routes/
│   ├── models/
│   ├── types/
│   ├── utils/
│   ├── errors/
│   ├── docs/           # Swagger and API reference
│   ├── tests/          # Jest tests
│   └── index.ts        # Main server
│
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
│
├── .env
├── tsconfig.json
├── package.json
```

🔐 SECURITY & PRIVACY PLAN (Ongoing & Phase 4)
*   GDPR-style data policy
*   Data Privacy Officer Role
*   Secure tokens and access control (largely implemented)
*   Secure audit trail for medical edits

🧪 TESTING STRATEGY
*   Jest unit tests for services
*   Supertest for API endpoints
*   CI pipeline for backend
*   Postman / Swagger tests for APIs

🌍 LAUNCH PLAN (Updated)
Stage       Milestone
✅ Phase 1A  Core Backend Models + CRUD (Completed)
✅ Phase 1B  Robust Authentication & Authorization (Completed)
🔜 Phase 1C  Core IVR/SMS System (Next Priority)
🔜 Phase 2   Refined AI Logic & Initial Integrations
🔜 Phase 3   Frontend + PWA Development
🔜 Phase 4   Hosting, CI/CD, Advanced Security & Privacy
🔜 Phase 5   Pilot Launch (Koidu + Freetown)

🏁 CLOSING STRATEGY
LifeSync is not just a booking app. It is a human-centered medical infrastructure built for access, inclusion, and efficiency — a fusion of healthcare and intelligence. Our execution engine (Gemini CLI, engineers) is focused on delivering this vision. This document is our north star.
