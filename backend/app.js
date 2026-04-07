import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import path from 'path'
import fs from 'fs'
import env from './config/env.js'
import apiRoutes from './routes/index.js'
import errorMiddleware from './middleware/errorMiddleware.js'

const app = express()

// Ensure upload directory exists.
const uploadDir = path.resolve(env.UPLOAD_DIR)
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

app.use(helmet())
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  }),
)
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'))
app.use(express.json({ limit: '10mb' }))

// Expose uploaded files for integration.
app.use('/uploads', express.static(uploadDir))

app.use('/api', apiRoutes)

app.get('/health', (req, res) => res.status(200).json({ success: true, message: 'OK', data: {} }))

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Not found', data: {} })
})

app.use(errorMiddleware)

export default app

