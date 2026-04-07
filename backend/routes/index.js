import { Router } from 'express'
import authRoutes from './auth.routes.js'
import patientRoutes from './patient.routes.js'
import doctorRoutes from './doctor.routes.js'
import appointmentRoutes from './appointments.routes.js'
import adminRoutes from './admin.routes.js'
import userRoutes from './users.routes.js'
import medicalRecordRoutes from './medicalRecord.routes.js'

const router = Router()

router.use('/auth', authRoutes)
router.use('/patient', patientRoutes)
router.use('/doctor', doctorRoutes)
router.use('/appointments', appointmentRoutes)
router.use('/admin', adminRoutes)
router.use('/users', userRoutes)
router.use('/medical-record', medicalRecordRoutes)

export default router

