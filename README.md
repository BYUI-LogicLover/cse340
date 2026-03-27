# CSE 340 Service Network

A full-stack web application that connects volunteers with service opportunities in their community. Browse organizations, discover projects, and find meaningful ways to serve.

Built with **Node.js**, **Express 5**, **PostgreSQL**, and **EJS**.

---

## Features

- **Organizations** — Create, view, edit, and manage partner organizations with logos and contact info
- **Service Projects** — Browse upcoming projects, filter by category, and track dates/locations
- **Categories** — Organize projects by service type (education, healthcare, environment, etc.)
- **Flash Messaging** — User-friendly feedback for form submissions and actions
- **Form Validation** — Server-side validation with express-validator
- **SQL Injection Protection** — All queries use parameterized statements

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ES Modules) |
| Framework | Express.js 5 |
| Database | PostgreSQL |
| Templating | EJS |
| Sessions | express-session |
| Validation | express-validator |
| Dev Server | Nodemon |

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Installation

```bash
git clone <repo-url>
cd cse340
npm install
```

### Configuration

Create a `.env.development` file in the project root:

```env
PORT=3000
NODE_ENV=development
DB_URL=postgresql://user:password@host:port/database
SESSION_SECRET=your-secret-key
ENABLE_SQL_LOGGING=true
```

### Run

```bash
# Development (auto-reload on file changes)
npm run dev

# Production
npm start
```

The app runs at `http://127.0.0.1:3000`.

## Project Structure

```
cse340/
├── server.js                    # Express entry point
├── public/                      # Static assets (CSS, images)
└── src/
    ├── controllers/             # Route handlers & business logic
    │   ├── routes.js            # Central route definitions
    │   ├── organizations.js     # Organization CRUD
    │   ├── projects.js          # Project CRUD
    │   └── categories.js        # Category display & assignment
    ├── models/                  # Database queries
    │   ├── db.js                # PostgreSQL connection pool
    │   ├── organizations.js
    │   ├── projects.js
    │   └── categories.js
    ├── middleware/               # Express middleware
    │   └── flash.js             # Session-based flash messages
    └── views/                   # EJS templates
        ├── partials/            # Reusable header & footer
        └── errors/              # 404 & 500 pages
```

## Architecture

The app follows an **MVC pattern** with clean separation of concerns:

- **Models** handle all database interaction through parameterized queries
- **Controllers** contain route logic, validation, and orchestration
- **Views** use EJS with shared partials for consistent layout

Sessions power a flash message system that persists feedback across redirects. In development mode, SQL queries are logged with timing information for debugging.