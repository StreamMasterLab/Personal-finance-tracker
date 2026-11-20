# Personal Finance Tracker — Backend (Node.js + Express.js + MongoDB)

## Roles: Admin vs Client
- Every user registered via `/auth/register` is created with `role: "client"` — there is no way to self-register as admin.
- To create your first admin account, run:
  ```
  node scripts/createAdmin.js "Admin Name" admin@example.com yourpassword
  ```
  This creates a new admin, or promotes an existing user with that email to admin if one already exists.
- `login` now returns `role` in the response `data` — use it on the frontend to route admins and clients to different areas.

### Admin — `/web/api/admin` (requires `role: "admin"`, else 403)
| Method | Route | Description |
|---|---|---|
| GET | /clients | List all client accounts |
| GET | /clients/:id | One client's profile + total income/expense/balance |
| DELETE | /clients/:id | Remove a client and all their transactions/categories/budgets/goals/notifications |

## Setup
1. `npm install`
2. Make sure MongoDB is running locally (or update `dbUrl` in `.env` to your Atlas URI)
3. `npm start` (uses nodemon, runs on the PORT set in `.env`, default 3000)

All routes except `register`, `login`, `forgot-password` require a header:
`Authorization: Bearer <token>` (token returned from login)

## Folder Structure
```
App/
  models/         -> Mongoose schemas
  controllers/web/-> business logic
  routes/web/     -> route definitions
  middlewares/    -> authMiddleware.js (JWT check)
index.js          -> app entry, DB connection, route mounting
.env              -> dbUrl, PORT, jwtSecret
```

## API Endpoints

### Auth — `/web/api/auth`
| Method | Route | Description |
|---|---|---|
| POST | /register | Register new user |
| POST | /login | Login, returns JWT |
| POST | /forgot-password | Reset password by email |
| GET | /profile | Get logged-in user profile |
| PUT | /profile-update | Update name/email |

### Category — `/web/api/category`
| Method | Route | Description |
|---|---|---|
| POST | /add | Add category (Food, Transport, Others, ...) |
| GET | /list | List user's categories |
| PUT | /update/:id | Update category |
| DELETE | /delete/:id | Delete category |

### Transaction — `/web/api/transaction`
| Method | Route | Description |
|---|---|---|
| POST | /add | Add income/expense (`type` field decides) |
| GET | /list | List all transactions |
| GET | /search?keyword= | Search by note |
| PUT | /update/:id | Edit transaction |
| DELETE | /delete/:id | Delete transaction |

### Budget — `/web/api/budget`
| Method | Route | Description |
|---|---|---|
| POST | /set | Set monthly budget for a category |
| GET | /list | List budgets |
| GET | /remaining?month=&year= | Remaining budget + auto budget-warning notification |
| PUT | /update/:id | Update limit |
| DELETE | /delete/:id | Delete budget |

### Goal — `/web/api/goal`
| Method | Route | Description |
|---|---|---|
| POST | /add | Add savings goal |
| GET | /list | List goals with progress % |
| PUT | /update-progress/:id | Add saved amount |
| DELETE | /delete/:id | Delete goal |

### Dashboard — `/web/api/dashboard`
| Method | Route | Description |
|---|---|---|
| GET | /summary?month=&year= | Total balance, monthly income/expense, savings |
| GET | /chart | Category-wise expense breakdown for charts |

### Report — `/web/api/report`
| Method | Route | Description |
|---|---|---|
| GET | /daily \| /weekly \| /monthly | Report by period |
| GET | /export/pdf | Downloads a real generated PDF file (uses `pdfkit`) |

### Notification — `/web/api/notification`
| Method | Route | Description |
|---|---|---|
| GET | /list | List notifications |
| PUT | /mark-read/:id | Mark as read |
| DELETE | /delete/:id | Delete notification |

## Security
- Passwords hashed with bcryptjs
- JWT-based session auth (`authMiddleware.js`)
- Mongoose schema validation (email format, required fields, enums)
- All queries scoped by `userId` from the verified token, not from the request body — prevents users from accessing others' data

## Notes / Next Steps
- Bill reminders and email alerts (Notification module) need a scheduler (e.g. `node-cron`) plus an email service (e.g. Nodemailer) — not wired yet, happy to add.
