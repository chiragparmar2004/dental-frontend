# Deployment Guide

## Backend Deployment (Vercel/Railway/Heroku)

### Environment Variables
\`\`\`
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=production
CLIENT_URL=https://your-frontend-domain.com
\`\`\`

### Deploy Options:
1. **Railway**: Connect GitHub repository, set env vars
2. **Heroku**: `heroku create`, `git push heroku main`
3. **Vercel**: Backend as serverless functions (see `/api` folder structure)

## Frontend Deployment (Vercel)

### Environment Variables
\`\`\`
NEXT_PUBLIC_API_BASE_URL=https://your-backend-domain.com/api
\`\`\`

### Deploy:
\`\`\`bash
npm install
npm run build
vercel deploy
\`\`\`

## Database Setup

### MongoDB Atlas (Recommended)
1. Create cluster at mongodb.com
2. Get connection string
3. Set as `MONGO_URI` environment variable

### Local MongoDB
\`\`\`bash
mongod
# Connection: mongodb://localhost:27017/dental-recruit
\`\`\`

## Initial Setup

1. Seed superadmin: `npm run seed` (backend)
2. Login: `admin@dentalrecruit.com` / `Admin@123`
3. Test workflows before production
