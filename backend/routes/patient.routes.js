import path from 'path'
import fs from 'fs'
import multer from 'multer'
import { Router } from 'express'
import env from '../config/env.js'
import authMiddleware from '../middleware/authMiddleware.js'
import roleMiddleware from '../middleware/roleMiddleware.js'
import { getProfile, updateProfile, getAppointments, uploadReport } from '../controllers/patient.controller.js'

const router = Router()

router.use(authMiddleware)
router.use(roleMiddleware(['patient']))

const uploadDir = path.resolve(env.UPLOAD_DIR)
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase()
    const safeExt = ext || ''
    cb(null, `report_${Date.now()}_${Math.random().toString(16).slice(2)}${safeExt}`)
  },
})

const allowedMimes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']
const upload = multer({
  storage,
  limits: { fileSize: env.MAX_UPLOAD_BYTES },
  fileFilter: (req, file, cb) => {
    if (allowedMimes.includes(file.mimetype)) return cb(null, true)
    return cb(new Error('Only PDF and image files are allowed'), false)
  },
})

router.get('/profile', getProfile)
router.put('/profile', updateProfile)
router.get('/appointments', getAppointments)
router.post('/upload-report', upload.single('report'), uploadReport)

export default router

