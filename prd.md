# Product Requirements Document (PRD) - Hostel Complaint Platform

## 1. Project Overview
The Hostel Complaint Platform is a MERN stack application designed to streamline the process of raising, tracking, and resolving maintenance issues within a hostel environment. It serves three primary user roles: Students, Wardens, and Administrators.

## 2. Current Status (What is Done) ✅
- **Database Architecture:** PostgreSQL database connection established with automatic table creation (`users`, `rooms`, `complaints`).
- **Authentication System:** Complete JWT-based registration and login system with password hashing (bcrypt).
- **Core APIs:** CRUD operations for complaints (Student & Admin) and rooms (Admin).
- **Frontend Foundation:** React 19 + Vite setup with Tailwind CSS and Framer Motion for animations.
- **State Management:** React Context implemented for Auth, Complaints, and Theme (Dark/Light mode).
- **Routing:** Role-based protected routes implemented.
- **UI Components:** Reusable components like Buttons, Inputs, Cards, Badges, and Modals.
- **Dashboards:** Basic dashboard layouts for Student, Warden, and Admin.
- **Student Features:** Raise complaints, view own complaints.
- **Admin Features:** View all complaints, view users.

## 3. Implementation Plan (What Needs to be Done) 🚀
*The following tasks must be completed in order to deliver a fully functional product.*

### Priority 1: Critical Database & Schema Fixes 🔴
1. **Fix Role Constraint:** Update `server/config/db.js` to include `'warden'` in the `users.role` CHECK constraint.
2. **Fix Status Constraint:** Update `server/config/db.js` to include `'Escalated'` in the `complaints.status` CHECK constraint.
3. **Add Block/Hostel field:** Add a `block` column to the `users` table or `rooms` table to support warden assignments. For simplicity, we'll add `block VARCHAR(10)` to `users`.

### Priority 2: Warden Functionality 🔴
4. **Warden Backend Routes:** Create API endpoints for wardens to fetch complaints specific to their assigned block and update their statuses.
5. **Warden Dashboard Integration:** Connect `client/src/pages/warden/Dashboard.jsx` to the real API instead of using hardcoded mock data.
6. **Escalation Flow:** Ensure the `escalateComplaint` function in `ComplaintContext.jsx` works with the updated backend.

### Priority 3: Missing Admin Features 🟡
7. **Rooms Management UI:** Create a frontend page (`client/src/pages/admin/Rooms.jsx`) to consume the existing `/api/rooms` backend routes. Add it to the routing and sidebar.
8. **Admin Dashboard Stats:** Ensure the Admin Dashboard displays real statistics from `/api/complaints/stats`.

### Priority 4: Developer Experience & Refinements 🟡
9. **Nodemon Setup:** Add `"dev": "nodemon server.js"` to `server/package.json` for hot-reloading.
10. **Environment Variables:** Create a `client/.env` file with `VITE_API_URL`.
11. **Settings / Password Update:** Implement the backend route for password change and connect it to `SettingsModal.jsx`.

### Priority 5: Polish & Enhancements 🟢
12. **Upvote Feature:** Either implement the backend logic for upvoting complaints or remove the UI button.
13. **Notifications:** Implement basic real or local-state notifications for the `NotificationDropdown`.

---
*Execution of this PRD will commence immediately following the order specified above.*
