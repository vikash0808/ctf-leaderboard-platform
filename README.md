# 🚩 CTF Leaderboard Platform

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)

A full-stack **Capture The Flag (CTF)** competition hosting and real-time leaderboard platform built with **React**, **Node.js / Express**, **MongoDB**, and **Nginx**. Supports both individual and team-based cybersecurity competitions, dynamic scoring, admin management, and per-team Dockerized challenges.

---

## ✨ Key Features

- **Challenge & Admin Management:** Create challenges, file attachments, hints, code snippets, and flags directly from the admin dashboard.
  - Flag submission brute-force protection & Nginx rate-limiting (`nginx_ctf.conf`)
  - Dynamic per-team flags and dynamic scoring with configurable decay
  - Dockerized challenge container support per team
- **Individual & Team Competitions:** Support for solo participants or teams, First Blood tracking, and user/team administration (promoting, banning, verification).
- **Live Scoreboard & Analytics:** Automatic tie resolution, global & per-team statistics, interactive charts (`@ant-design/plots`), and JSON scoreboard import/export.
- **Security & Reliability Hardening:**
  - Startup validation for required environment variables (`MONGODB_CONNSTRING`, `SESSION_SECRET`)
  - `express-mongo-sanitize` NoSQL-injection protection, `httpOnly` + `sameSite: "lax"` session cookies, CORS preflight (`204`) handling, and `async/await` error-handled auth middleware
  - Cryptographically secure default admin password generation (`crypto.randomBytes`)
  - Health check endpoint (`GET /api/health`) and resilient React session loader (`frontEnd/src/App.jsx`)

---

## 🏗️ Project Structure

```text
ctf-leaderboard-platform/
├── backEnd/
│   ├── server.js          # Express server, CORS, session auth & /api/health
│   ├── setup.js           # Initial DB seed & crypto-secure admin bootstrap
│   ├── .env.example       # Backend environment variable template
│   ├── controllers/       # Business logic
│   ├── models/            # Mongoose schemas
│   ├── routes/            # Global, user, and admin API routes
│   └── package.json
├── frontEnd/
│   ├── src/App.jsx        # React SPA root, theme loader & session bootstrap
│   ├── .env.example       # Frontend environment variable template
│   └── package.json
├── nginx_ctf.conf         # Production Nginx reverse proxy & rate limiting
├── .gitignore
└── README.md
```

---

## 💻 Local Setup

### Prerequisites
- **Node.js** (v16+ / v18+)
- **MongoDB** (local Community Server or MongoDB Atlas)

### 1. Clone the Repository
```bash
git clone https://github.com/vikash0808/ctf-leaderboard-platform.git
cd ctf-leaderboard-platform
```

### 2. Configure Environment Variables
Copy the bundled templates to `.env` and fill in your values:
- `backEnd/.env.example` → `backEnd/.env` (`MONGODB_CONNSTRING`, `SESSION_SECRET`, `FRONTEND_URI`, `PORT`)
- `frontEnd/.env.example` → `frontEnd/.env` (`REACT_APP_BACKEND_URI=http://localhost:3001`)

### 3. Start MongoDB
Ensure your MongoDB service is running locally (or configure a MongoDB Atlas URI in `backEnd/.env`).

### 4. Start the Backend
```bash
cd backEnd
npm install
npm start
```
Verify the API is up at `http://localhost:3001/api/health`.

### 5. Start the Frontend
```bash
cd frontEnd
npm install
# Development mode:
npm run start-react
# Or production build & serve:
npm start
```

> **Production Note:** You can use `pm2` to run the backend/frontend behind `nginx_ctf.conf`. On first boot, `setup.js` prints a randomly generated initial `admin` password to the server console—change or remove it immediately after setup.

---

## 👨‍💻 Maintained By

**Vikash Dhillan** — GitHub: [@vikash0808](https://github.com/vikash0808)
