import mongoose from 'mongoose'
import env from './env.js'

export async function connectDb() {
  if (env.DB_ADAPTER !== 'mongoose') return
  if (!env.MONGODB_URI) throw new Error('MONGODB_URI is required when DB_ADAPTER=mongoose')

  mongoose.set('strictQuery', false)

  await mongoose.connect(env.MONGODB_URI)
  // eslint-disable-next-line no-console
  console.log('[DB] Connected to MongoDB')
}

