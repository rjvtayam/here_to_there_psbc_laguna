<div align="center">

# 🎥 Here to There

### Live Video Portal for Intercampus Communication

**A real-time video communication platform connecting PSBC Paete and PSBC Pagsanjan campuses through seamless WebRTC-powered video sessions, instant messaging, and live portal mode.**

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-5.12-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)
[![WebRTC](https://img.shields.io/badge/WebRTC-Real--time-FF6600?style=for-the-badge&logo=webrtc&logoColor=white)](https://webrtc.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

<img src="docs/preview.png" alt="Here to There Preview" width="800" />

</div>

---

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Security](#security)
- [Contributing](#contributing)

---

## 🎯 About the Project

**Here to There** is a capstone project built for PSBC (Polytechnic State College of the Philippines) connecting the Paete and Pagsanjan campuses through a live video portal. The platform enables:

- **Real-time video communication** between campuses via WebRTC
- **Independent audio channels** — cross-campus talk buttons and same-campus microphone
- **Portal mode** with three states: Portal, In Meeting, and Live
- **Screen sharing** with a Google Meet-style layout
- **Emergency broadcast system** for campus-wide alerts
- **Secure authentication** with JWT and optional 2FA (TOTP)
- **Real-time chat** with campus-specific and all-campus channels
- **Notification system** with bulletins and emergency alerts

---

## ✨ Features

### 🎬 Video & Audio
- Peer-to-peer WebRTC video calls between campuses
- Independent audio channels: Talk buttons (cross-campus) and Mic (same-campus)
- HD/SD video quality toggle (720p/480p)
- Camera on/off with animated avatar indicator
- Screen sharing with Google Meet-style participant layout

### 🟢 Portal Mode (3 States)
| State | Description |
|-------|-------------|
| **PORTAL** (Green) | Campus live feed active — controls disabled |
| **IN MEETING** (Amber) | Campus-only mode — restricted communication |
| **LIVE** (Cyan) | Full cross-campus — everything enabled |

### 💬 Communication
- Real-time chat with All Campus and Campus-specific tabs
- Emergency broadcast system (principal-only trigger)
- Bulletin board with notification system
- Role-based access: Principal, Admin, Teacher, Staff

### 🔐 Security
- JWT authentication with HTTP-only cookies + Bearer header (dual mode)
- Two-Factor Authentication (TOTP with QR code)
- Account lockout after 5 failed login attempts
- Failed login audit logging with IP tracking
- Password strength enforcement (uppercase, lowercase, number, special char)
- Rate limiting on all auth endpoints
- HTTP security headers (HSTS, CSP, X-Frame-Options)
- SQL injection prevention via SQLAlchemy ORM
- Input validation and sanitization
- Field-level AES-256-GCM encryption for sensitive data

### 👥 User Management
- Admin dashboard with user CRUD operations
- Profile management with avatar upload (server-side magic byte verification)
- Password change with audit logging
- Activity log tracking

---

## 🛠 Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| TypeScript 5 | Type safety |
| Vite 6 | Build tool & dev server |
| Tailwind CSS 3 | Styling & design system |
| Zustand 5 | State management |
| React Router 6 | Client-side routing |
| Socket.IO Client | Real-time communication |
| Axios | HTTP client |
| Lucide React | Icon library |

### Backend

| Technology | Purpose |
|------------|---------|
| FastAPI | REST API framework |
| SQLAlchemy 2 | ORM & database management |
| PostgreSQL 17 | Primary database |
| python-socketio | WebSocket server |
| python-jose | JWT token handling |
| passlib + bcrypt | Password hashing |
| PyOTP | Two-Factor Authentication |
| Alembic | Database migrations |
| SlowAPI | Rate limiting |

### Infrastructure

| Technology | Purpose |
|------------|---------|
| Docker & Docker Compose | Containerization |
| Google STUN Server | WebRTC NAT traversal |
| Socket.IO | Real-time event broadcasting |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
│   React + TypeScript + Tailwind CSS + Zustand               │
│                                                              │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│   │  Campus   │  │ Control  │  │   Chat   │  │ Profile  │   │
│   │   View    │  │   Room   │  │  Panel   │  │ Settings │   │
│   └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│        │              │              │              │         │
│        └──────────────┴──────┬───────┴──────────────┘        │
│                              │                               │
│                    ┌─────────▼─────────┐                     │
│                    │   HTTP / Socket.IO │                     │
│                    └─────────┬─────────┘                     │
└──────────────────────────────┼───────────────────────────────┘
                               │
┌──────────────────────────────┼───────────────────────────────┐
│                        Backend                                │
│   FastAPI + SQLAlchemy + python-socketio                      │
│                                                              │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│   │   Auth   │  │  Users   │  │ Profile  │  │ Notifs   │   │
│   │  (JWT)   │  │   CRUD   │  │  2FA     │  │          │   │
│   └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│        └──────────────┴──────┬───────┴──────────────┘        │
│                              │                               │
│   ┌──────────────────────────▼───────────────────────────┐   │
│   │              Signaling Server (Socket.IO)             │   │
│   │   WebRTC Signaling · Room Management · Events        │   │
│   └──────────────────────────┬───────────────────────────┘   │
│                              │                               │
│                    ┌─────────▼─────────┐                     │
│                    │    PostgreSQL 17   │                     │
│                    └───────────────────┘                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.10+
- **PostgreSQL** 15+
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rjvtayam/here_to_there_psbc_laguna.git
   cd here_to_there_psbc_laguna
   ```

2. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

4. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb here_to_there

   # Run migrations
   cd backend
   alembic upgrade head

   # Seed initial data
   python seed.py
   ```

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Database
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/here_to_there

# JWT (generate a strong secret for production)
JWT_SECRET_KEY=your-super-secret-key-change-this
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# CORS
ALLOWED_ORIGINS=["http://localhost:5173"]

# WebRTC
STUN_SERVER=stun:stun.l.google.com:19302
```

> ⚠️ **Never commit your `.env` file.** It is already included in `.gitignore`.

### Running the App

**Option A: Manual**
```bash
# Terminal 1 — Backend
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2 — Frontend
cd frontend
npm run dev
```

**Option B: Docker Compose**
```bash
docker-compose up --build
```

The app will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/api/docs

---

## 📁 Project Structure

```
here_to_there_psbc_laguna/
├── backend/
│   ├── app/
│   │   ├── api/v1/           # API route handlers
│   │   │   ├── auth.py       # Authentication endpoints
│   │   │   ├── users.py      # User management
│   │   │   ├── profile.py    # Profile, 2FA, avatar
│   │   │   └── notifications.py
│   │   ├── models/           # SQLAlchemy models
│   │   ├── schemas/          # Pydantic validation schemas
│   │   ├── services/         # Business logic layer
│   │   ├── signaling/        # Socket.IO event handlers
│   │   ├── middleware/        # CORS, security headers, rate limiting
│   │   ├── utils/            # JWT, password hashing utilities
│   │   ├── config.py         # Application settings
│   │   ├── database.py       # Database engine & session
│   │   └── main.py           # FastAPI app factory
│   ├── alembic/              # Database migrations
│   ├── uploads/              # Avatar file storage
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── api/              # API client layer
│   │   ├── components/       # Reusable UI components
│   │   │   ├── chat/         # ChatPanel
│   │   │   ├── controls/     # TalkButton, PortalToggle, EmergencyButton
│   │   │   ├── indicators/   # PortalStatus, MicTalking
│   │   │   ├── layout/       # Sidebar, Header, DashboardLayout
│   │   │   └── video/        # VideoCard, VideoControls
│   │   ├── hooks/            # Custom React hooks (useAuth, useSocket, useWebRTC)
│   │   ├── pages/            # Route pages
│   │   │   ├── Login.tsx
│   │   │   ├── control-room/ # Admin views
│   │   │   └── campus/       # Campus principal views
│   │   ├── stores/           # Zustand state stores
│   │   ├── styles/           # Global CSS
│   │   ├── types/            # TypeScript type definitions
│   │   └── lib/              # Constants, utilities
│   ├── package.json
│   ├── tailwind.config.js
│   └── Dockerfile
├── docker-compose.yml
├── .env.example
└── .gitignore
```

---

## 📚 API Documentation

Once the backend is running, access the interactive API docs:

- **Swagger UI**: http://localhost:8000/api/docs
- **ReDoc**: http://localhost:8000/api/redoc

### Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/auth/login` | Authenticate user (returns 2FA flag if enabled) |
| `POST` | `/api/v1/auth/2fa-login` | Verify 2FA code |
| `POST` | `/api/v1/auth/register` | Register new user |
| `POST` | `/api/v1/auth/refresh` | Refresh access token |
| `POST` | `/api/v1/auth/logout` | Clear auth cookies |
| `GET` | `/api/v1/auth/me` | Get current user profile |
| `PUT` | `/api/v1/profile/me` | Update profile |
| `POST` | `/api/v1/profile/change-password` | Change password |
| `POST` | `/api/v1/profile/avatar` | Upload avatar |
| `POST` | `/api/v1/profile/2fa/setup` | Setup 2FA |
| `GET` | `/api/v1/users/` | List users (admin) |

### Socket.IO Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `join_room` | Client → Server | Join a video room |
| `leave_room` | Client → Server | Leave a video room |
| `webrtc_offer` | Client → Server | Send WebRTC offer |
| `webrtc_answer` | Client → Server | Send WebRTC answer |
| `ice_candidate` | Client → Server | Send ICE candidate |
| `chat_message` | Client → Server | Send chat message |
| `talk_to` | Client → Server | Toggle cross-campus talk |
| `portal_mode_changed` | Client → Server | Update portal mode |
| `emergency_trigger` | Client → Server | Trigger emergency broadcast |
| `room_users` | Server → Client | Broadcast room membership |
| `peer_joined` | Server → Client | Notify new peer |
| `peer_left` | Server → Client | Notify peer disconnect |
| `peer_portal_mode` | Server → Client | Broadcast portal state |
| `chat_message` | Server → Client | Broadcast chat message |
| `emergency_alert` | Server → Client | Broadcast emergency |

---

## 🔒 Security Features

| Feature | Description |
|---------|-------------|
| **JWT Authentication** | Short-lived access tokens (30 min) with refresh token rotation (7 days) |
| **HTTP-Only Cookies** | Tokens stored in HttpOnly, Secure, SameSite=Strict cookies + Bearer header (dual mode) |
| **Two-Factor Authentication** | TOTP-based 2FA with QR code setup (Google Authenticator compatible) |
| **Account Lockout** | Automatic lockout after 5 failed login attempts (30-minute cooldown) |
| **Failed Login Logging** | All failed attempts logged with email, IP address, and attempt count |
| **Password Policy** | Minimum 8 characters with uppercase, lowercase, number, and special character |
| **Rate Limiting** | 10 req/min login, 5 req/min register, 5 req/min password change |
| **HTTP Security Headers** | HSTS, X-Frame-Options: DENY, X-Content-Type-Options: nosniff, Referrer-Policy, Permissions-Policy |
| **CORS Protection** | Strict origin allowlist for HTTP and Socket.IO connections |
| **SQL Injection Prevention** | SQLAlchemy ORM with parameterized queries |
| **Input Validation** | Pydantic schemas for all API inputs, length limits on chat/emergency messages |
| **File Upload Security** | Server-side magic byte detection, path traversal prevention, 5MB limit |
| **Audit Logging** | Login success/failure, profile changes, password changes, 2FA changes — all with IP |
| **Database Connection Pooling** | QueuePool with 10 connections, 20 overflow, 1800s recycle, health checks |
| **Field-Level Encryption** | AES-256-GCM encryption utility for sensitive data at rest |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

<div align="center">

**Built with ❤️ for PSBC Paete & PSBC Pagsanjan**

*Capstone Project — 2026*

</div>
