# GigFlow

GigFlow is a full-stack MERN freelance marketplace where clients post gigs and freelancers submit bids.
The system supports atomic hiring logic and real-time notifications.

---

## Features

- JWT authentication using HttpOnly cookies
- Create, browse, and search gigs
- Freelancers can place bids on gigs
- Only one freelancer can be hired per gig
- Atomic hiring using MongoDB transactions
- Real-time notifications using Socket.io

---

## Tech Stack

### Frontend
- React 18 (Vite)
- Redux Toolkit
- React Router v6
- Axios
- Tailwind CSS
- Socket.io Client

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs
- Socket.io
- cookie-parser

---

## Architecture Overview

- Secure authentication using HttpOnly cookies
- MongoDB transactions to prevent race conditions
- WebSocket-based real-time notifications

---

## Prerequisites

- Node.js v16 or higher
- MongoDB (Local or Atlas)
- npm or yarn
- Git

---

## Installation

### Clone Repository
```bash
git clone https://github.com/yourusername/gigflow.git
cd gigflow
```

### Backend
```
cd backend
npm install
```
## backend .env
```
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://localhost:27017/gigflow
JWT_SECRET=your_secret_key
```

### Frontend
```
cd frontend
npm install
```
## frontend .env 
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```
# Start Backend
```
cd backend
npm run dev
```
# Start Backend
```
cd frontend
npm run dev
```
