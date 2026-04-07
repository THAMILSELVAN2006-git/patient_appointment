import { Router } from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import roleMiddleware from '../middleware/roleMiddleware.js'
import { listUsers, listDoctors } from '../controllers/users.controller.js'

const router = Router()

router.use(authMiddleware)

router.get('/', roleMiddleware(['admin']), listUsers)
router.get('/doctors', roleMiddleware(['patient']), listDoctors)

export default router
