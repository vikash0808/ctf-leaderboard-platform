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
  - Flag submission brute-force protection
  - Dynamic per-team flags and dynamic scoring with configurable decay
  - Dockerized challenge container support per team
- **Individual & Team Competitions:** Support for solo participants or teams, First Blood tracking, and user/team administration (promoting, banning, verification).
- **Live Scoreboard & Analytics:** Automatic tie resolution, global & per-team statistics, interactive charts (`@ant-design/plots`), and JSON scoreboard import/export.
- **Competition Scheduling & Customization:** Configure start/end timers, email verification, site theme colors, rules, and frontpage content.
- **Security Hardening:** Includes `bcryptjs` password hashing, `express-session` with Mongo store, `express-mongo-sanitize`, `xss-clean`, and input validation.

---

## 🏗️ Project Structure

```text
ctf-leaderboard-platform/
├── frontEnd/        # React SPA (React Router, Ant Design Plots, Ace Editor)
├── backEnd/         # Node.js / Express REST API & MongoDB (Mongoose) models
├── nginx_ctf.conf   # Nginx reverse-proxy configuration
├── package.json     # Root dependencies
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
Copy `.env.example` to `.env` inside each service directory and populate your values:
- `/backEnd/.env`
- `/frontEnd/.env`
- `/dockerAPI/.env` *(if running Dockerized challenges)*

### 3. Start MongoDB
Ensure your MongoDB service is running locally (or point your backend `.env` to a remote MongoDB URI).

### 4. Start the Backend
```bash
cd backEnd
npm install
npm start
```

### 5. Start the Frontend
```bash
cd frontEnd
npm install
# Development mode:
npm run start-react
# Or production build & serve:
npm start
```

> **Production Note:** You can use `pm2` to manage the Node.js backend/frontend processes alongside `nginx_ctf.conf`. Remember to create an admin account and remove any default `admin:admin` credentials after initial setup.

---

## 👨‍💻 Maintained By

**Vikash Dhillan** — GitHub: [@vikash0808](https://github.com/vikash0808)
