import { Router } from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import roleMiddleware from '../middleware/roleMiddleware.js'
import { listUsers, createDoctor, deleteUser, analytics } from '../controllers/admin.controller.js'

const router = Router()
router.use(authMiddleware)
router.use(roleMiddleware(['admin']))

router.get('/users', listUsers)
router.post('/doctors', createDoctor)
router.delete('/users/:id', deleteUser)
router.get('/analytics', analytics)

export default router

