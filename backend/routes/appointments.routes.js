import { Router } from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import roleMiddleware from '../middleware/roleMiddleware.js'
import {
  book,
  reschedule,
  cancel,
  list,
  listPatientAppointments,
  listDoctorAppointments,
  updateStatus,
} from '../controllers/appointments.controller.js'

const router = Router()

router.use(authMiddleware)

router.post('/', roleMiddleware(['patient']), book)
router.get('/patient', roleMiddleware(['patient']), listPatientAppointments)
router.get('/doctor', roleMiddleware(['doctor']), listDoctorAppointments)
router.put('/:id/status', roleMiddleware(['doctor']), updateStatus)

router.put('/:id', roleMiddleware(['patient']), reschedule)
router.delete('/:id', roleMiddleware(['patient', 'doctor', 'admin']), cancel)
router.get('/', list)

export default router

