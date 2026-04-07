import dotenv from 'dotenv'

dotenv.config()

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT || 3001),
  DB_ADAPTER: process.env.DB_ADAPTER || 'mongoose', // memory | mongoose
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/doctor_appointments',
  JWT_SECRET: process.env.JWT_SECRET || 'dev_jwt_secret_change_me',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  UPLOAD_DIR: process.env.UPLOAD_DIR || 'backend/uploads',
  MAX_UPLOAD_BYTES: Number(process.env.MAX_UPLOAD_BYTES || 5 * 1024 * 1024), // 5MB
  SEED_DEFAULT_ADMIN: (process.env.SEED_DEFAULT_ADMIN || 'true') === 'true',
  ADMIN_SEED_EMAIL: process.env.ADMIN_SEED_EMAIL || 'admin@smartcare.local',
  ADMIN_SEED_PASSWORD: process.env.ADMIN_SEED_PASSWORD || 'Admin@12345',
}

export default env

