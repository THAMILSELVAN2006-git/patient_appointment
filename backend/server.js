import bcrypt from 'bcrypt'
import env from './config/env.js'
import app from './app.js'
import { UserModel } from './models/index.js'
import { connectDb } from './config/db.js'
import http from 'http'

async function seedAdminIfNeeded() {
  if (!env.SEED_DEFAULT_ADMIN || env.NODE_ENV === 'production') return

  // Only seed if admin doesn't exist.
  const existing = await UserModel.findUserByEmail(env.ADMIN_SEED_EMAIL)
  if (existing) return

  const passwordHash = await bcrypt.hash(env.ADMIN_SEED_PASSWORD, 10)
  await UserModel.createUser({
    name: 'Admin',
    email: env.ADMIN_SEED_EMAIL,
    passwordHash,
    role: 'admin',
    specialization: null,
    profile: { seeded: true },
  })

  // eslint-disable-next-line no-console
  console.log(`[Bootstrap] Default admin created: ${env.ADMIN_SEED_EMAIL}`)
}

await connectDb()

await seedAdminIfNeeded()

function startServer() {
  const basePort = env.PORT || 3001
  const portsToTry = [basePort, basePort + 1, basePort + 2, basePort + 3]

  const tryListen = (portIndex) => {
    const port = portsToTry[portIndex]
    const server = http.createServer(app)

    server.once('listening', () => {
      // eslint-disable-next-line no-console
      console.log(`SmartCare+ backend listening on port ${port}`)
    })

    server.once('error', (err) => {
      if (err?.code === 'EADDRINUSE' && portIndex + 1 < portsToTry.length) {
        // eslint-disable-next-line no-console
        console.warn(`[Startup] Port ${port} in use. Trying ${portsToTry[portIndex + 1]}...`)
        return tryListen(portIndex + 1)
      }
      // eslint-disable-next-line no-console
      console.error('[Startup] Failed to start server:', err)
      process.exit(1)
    })

    server.listen(port)
  }

  tryListen(0)
}

startServer()

