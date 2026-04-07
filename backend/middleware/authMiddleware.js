import jwt from 'jsonwebtoken'
import env from '../config/env.js'
import AppError from '../utils/AppError.js'

export default function authMiddleware(req, res, next) {
  const header = req.headers.authorization || ''
  const [scheme, token] = header.split(' ')

  if (scheme !== 'Bearer' || !token) {
    throw new AppError('Unauthorized: missing token', 401)
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET)
    req.user = {
      id: decoded.sub,
      role: decoded.role,
      email: decoded.email,
    }
    return next()
  } catch (e) {
    throw new AppError('Unauthorized: invalid token', 401)
  }
}

