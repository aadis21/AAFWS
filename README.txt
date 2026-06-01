AAFWS Portal — Advocate & Advocate Family Welfare Society
===========================================================

ABOUT:
  A fully responsive HTML/CSS/JavaScript welfare portal
  for advocates and their families across India, complete with
  an administrative control panel and donation verification module.

DEVELOPMENT ENVIRONMENT:
  Frontend: HTML, CSS, JavaScript (Vanilla, no framework)
  Backend: Node.js, Express.js, MongoDB, Mongoose

PORT CONFIGURATIONS:
  - Backend API & Static Server: http://localhost:5000
  - Admin Dashboard Panel: http://localhost:5000/admin

PHASE 2 - SETUP AND RUNNING INSTRUCTIONS:
  1. Navigate to the backend directory:
     cd backend

  2. Install all required dependencies:
     npm install

  3. Configure your environment variables in `.env` (using `.env.example` as a template):
     PORT=5000
     MONGO_URI=mongodb+srv://...
     JWT_SECRET=aafwssecretkey
     ADMIN_EMAIL=admin@aafws.org
     ADMIN_PASSWORD=adminpassword

  4. Seed the default Admin Account:
     node seed/seedAdmin.js
     (This seeds the administrator account into your MongoDB database)

  5. Start the backend development server:
     npm run dev
     (Launches the server at http://localhost:5000 with nodemon auto-restart)

  6. Access the Admin Control Panel:
     Open http://localhost:5000/admin in your browser.
     Log in using your ADMIN_EMAIL and ADMIN_PASSWORD.

NEW PHASE 2 FEATURES:
  ✅ Secure Admin Login Dashboard with JWT token sessions.
  ✅ Automatic sequential Membership ID generator (AAFWS-YYYY-XXXX).
  ✅ Admin members table with search, pagination, status-toggles, and deletions.
  ✅ Client-side ID Card generator for front and back previews with custom QR codes.
  ✅ Bulk export members data securely into Excel (.xlsx), CSV (.csv), and PDF formats.
  ✅ QR-based donation module for public users with payment screenshot uploads.
  ✅ Administrative logs for reviewing, approving, or rejecting incoming donations.
  ✅ Settings page for updating QR codes, changing passwords, and editing instructions.
  ✅ Admin notification alerts for new members and donations.

VERSION: 2.0.0
SOCIETY: AAFWS — Advocate & Advocate Family Welfare Society