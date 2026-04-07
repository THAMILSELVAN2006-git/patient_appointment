import { Router } from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import roleMiddleware from '../middleware/roleMiddleware.js'
import { getAppointments, getPatient } from '../controllers/doctor.controller.js'

const router = Router()
router.use(authMiddleware)
router.use(roleMiddleware(['doctor']))

router.get('/appointments', getAppointments)
router.get('/patient/:id', getPatient)

export default router

