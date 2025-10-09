# MyContact

> **A modern MERN stack contact management application**  
> React + Vite frontend | Express + MongoDB backend

## 🎯 Overview

MyContact is a full-stack contact management application that allows users to:
- Create and manage personal accounts
- Add, edit, and delete contacts
- Securely authenticate using JWT
- Access contacts from anywhere with cloud deployment

---
## ✅ Prerequisites

- **Node.js** >= 18.x
- **npm** or **yarn**
- **MongoDB Atlas** account (or local MongoDB instance)
- **Git** (for cloning the repository)

---

## 📥 Installation

### 1. Clone the repository

```bash
git clone https://github.com/Miriam-code/MyContact.git
cd MyContact
```

### 2. Install dependencies

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd client
npm install
```

---

## 🔐 Environment Variables

### Backend (`server/.env`)

Create a `.env` file in the `server` directory:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/mycontact
JWT_SECRET=your_secure_jwt_secret_key
CORS=http://localhost:5173
PORT=3000
```

### Frontend (`client/.env`)

Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:3000
```

---

## 🚀 Running Locally

### Start the Backend

```bash
cd server

# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

Backend runs on: **http://localhost:3000**

### Start the Frontend

```bash
cd client

# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Frontend runs on: **http://localhost:5173**

---

## 🌐 Deployment
### 🔗 Live Deployment URLs

- **Frontend:** [https://mycontact-front-re53.onrender.com](https://mycontact-front-re53.onrender.com)
- **Backend API:** [https://mycontact-backend-chlz.onrender.com](https://mycontact-backend-chlz.onrender.com)
- **API Documentation:** [https://mycontact-backend-chlz.onrender.com/api-docs](https://mycontact-backend-chlz.onrender.com/api-docs)

---

## 📡 API Documentation

### Base URL

- **Local:** `http://localhost:3000`
- **Production:** `https://mycontact-backend-chlz.onrender.com`

### Endpoints

#### User Routes (`/user`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/user/register` | Create a new user account | ❌ |
| `POST` | `/user/auth` | Login and receive JWT token | ✅ |
| `GET` | `/user/me` | Get current user profile | ✅ |
| `GET` | `/user/get-all` | Get all users (admin) | ✅ |
| `PUT` | `/user/:id` | Update user information | ✅ |
| `DELETE` | `/user/:id` | Delete user account | ✅ |

#### Contact Routes (`/contact`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/contact/all` | Get all user's contacts | ✅ |
| `POST` | `/contact/` | Create a new contact | ✅ |
| `PUT` | `/contact/:id` | Update a contact | ✅ |
| `DELETE` | `/contact/:id` | Delete a contact | ✅ |

## 🧪 Testing

The project includes comprehensive Jest test suites for both user and contact controllers.

### Run Tests

```bash
cd server
npm test
```

### Test Coverage

- ✅ User registration and validation
- ✅ User authentication
- ✅ User profile management
- ✅ Contact CRUD operations
- ✅ Phone number validation
- ✅ JWT authentication
- ✅ Error handling

---

