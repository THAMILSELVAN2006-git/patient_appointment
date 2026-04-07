import { Router } from 'express'
import { authRateLimiter } from '../middleware/rateLimit.js'
import authMiddleware from '../middleware/authMiddleware.js'
import { register, login, profile } from '../controllers/auth.controller.js'

const router = Router()

router.post('/register', authRateLimiter(), register)
router.post('/login', authRateLimiter(), login)
router.get('/profile', authMiddleware, profile)

export default router

