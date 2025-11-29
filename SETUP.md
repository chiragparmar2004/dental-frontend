# Setup Guide - Running Frontend and Backend

This project has two separate servers:
1. **Next.js Frontend** - Runs on `http://localhost:3000`
2. **Express Backend** - Runs on `http://localhost:5000`

## Quick Start (Run Both Servers)

### Option 1: Run Both Together (Recommended)
```bash
npm run dev:all
```

This will start both the Next.js frontend and Express backend simultaneously.

### Option 2: Run Separately

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
npm run dev:backend
```

## Initial Setup

### 1. Install Frontend Dependencies
```bash
npm install
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
cd ..
```

### 3. Setup Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
MONGO_URI=mongodb://localhost:27017/dental-recruit
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### 4. Start MongoDB

Make sure MongoDB is running on your system:
- **Windows**: MongoDB should be running as a service
- **Mac/Linux**: `mongod` or `brew services start mongodb-community`

Or use MongoDB Atlas (cloud) and update `MONGO_URI` in `.env`

### 5. (Optional) Seed Database

Create a superadmin user:
```bash
cd backend
npm run seed
```

This creates:
- Email: `admin@dentalrecruit.com`
- Password: `Admin@123`

## Troubleshooting

### "Cannot connect to server" Error
- Make sure the backend server is running on port 5000
- Check that MongoDB is running
- Verify the `.env` file exists in the `backend/` directory

### Port Already in Use
- Change `PORT=5000` in `backend/.env` to a different port
- Update `NEXT_PUBLIC_API_BASE_URL` in your frontend `.env.local` if needed

### MongoDB Connection Error
- Ensure MongoDB is installed and running
- Check the `MONGO_URI` in `backend/.env` is correct
- For MongoDB Atlas, use the connection string from your cluster

