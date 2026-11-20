# Personal Finance Tracker 

```
backend/         Node.js + Express.js + MongoDB API
frontend-react/  React (Vite) frontend that calls the backend
```

They run as two separate servers at the same time — this isn't one combined
app, it's a backend API and a frontend client that talks to it over HTTP.

## 1. Run the backend
```
cd backend
npm install
npm start
```
- Needs MongoDB running locally (or update `dbUrl` in `backend/.env` to an Atlas URI).
- Runs on **http://localhost:3000** by default (see `.env`).
- Full API route list is in `backend/README.md`.

## 2. Run the frontend
In a second terminal:
```
cd frontend-react
npm install
npm run dev
```
- Runs on **http://localhost:5173** (Vite's default) — open that URL in your browser.
- Already configured to call the backend at `http://localhost:3000/web/api`
  (see `frontend-react/src/api.js` if you ever need to change that).

## First use
1. Open the frontend URL → you land on the **Home page** (project info + Login/Signup).
2. Click **Sign up** → creates a **client** account → redirects to Login automatically.
3. Log in → since you're a client, you land on the **client Dashboard**.
4. Add a category or two (e.g. Food, Salary) on the **Categories** page.
5. Add transactions, set budgets, add goals — the Dashboard, charts, and Reports pull from whatever you've entered.
6. Reports → **Export** now downloads a real generated PDF.

## Admin access
Public signup only ever creates **client** accounts — there's no self-service way to become admin (by design, for security).
To create your first admin, run this once from the `backend` folder:
```
cd backend
node scripts/createAdmin.js "Admin Name" admin@example.com yourpassword
```
Then log in with that email/password on the same frontend — the login response includes a `role`,
and the app automatically routes admins to `/admin` (a client list + per-client financial summary,
with the ability to remove a client and their data) instead of the client dashboard.

## Known gaps (by design, not bugs)
- **Bill reminders / email alerts**: not implemented. Only the budget-exceeded warning is
  auto-generated today (checked when you hit "Check" under Remaining Budget on the Budget page).
  Bill reminders and emails would need a scheduler (`node-cron`) and an email sender
  (`nodemailer`) added to the backend.

