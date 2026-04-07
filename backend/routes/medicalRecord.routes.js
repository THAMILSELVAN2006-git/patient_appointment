import { Router } from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import roleMiddleware from '../middleware/roleMiddleware.js'
import {
  createMedicalRecord,
  listPatientMedicalRecords,
} from '../controllers/medicalRecord.controller.js'

const router = Router()
router.use(authMiddleware)

router.post('/', roleMiddleware(['doctor']), createMedicalRecord)
router.get('/patient', roleMiddleware(['patient']), listPatientMedicalRecords)

export default router

