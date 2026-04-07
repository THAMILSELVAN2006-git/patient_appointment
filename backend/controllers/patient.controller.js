import Joi from 'joi'
import asyncHandler from '../middleware/asyncHandler.js'
import { validateJoi } from '../utils/validators.js'
import { successResponse } from '../utils/response.js'
import { UserModel, AppointmentModel } from '../models/index.js'
import { createMedicalReportForPatient } from '../services/reportService.js'
import AppError from '../utils/AppError.js'

export const getProfile = asyncHandler(async (req, res) => {
  const user = await UserModel.findUserById(req.user.id)
  if (!user) throw new AppError('User not found', 404)
  return res.status(200).json(successResponse('Profile fetched', { user }))
})

const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(120).optional(),
  phone: Joi.string().min(5).max(30).optional().allow(''),
  address: Joi.string().max(500).optional().allow(''),
  age: Joi.number().integer().min(0).max(130).optional(),
})

export const updateProfile = asyncHandler(async (req, res) => {
  const payload = validateJoi(updateProfileSchema, req.body)

  const { name, ...profileFields } = payload
  const updated = await UserModel.updateUserById(req.user.id, {
    ...(name ? { name } : {}),
    profile: { ...(await UserModel.findUserById(req.user.id)).profile, ...profileFields },
  })

  return res.status(200).json(successResponse('Profile updated', { user: updated }))
})

export const getAppointments = asyncHandler(async (req, res) => {
  const appointments = await AppointmentModel.listAppointmentsByPatient(req.user.id)
  return res.status(200).json(successResponse('Appointments fetched', { appointments }))
})

const uploadReportSchema = Joi.object({
  appointmentId: Joi.string().optional().allow(null, ''),
  description: Joi.string().max(1000).optional().allow(null, ''),
})

export const uploadReport = asyncHandler(async (req, res) => {
  if (!req.file) throw new AppError('Report file is required', 400)
  const payload = validateJoi(uploadReportSchema, req.body)

  const { report, fileUrl } = await createMedicalReportForPatient({
    patientId: req.user.id,
    appointmentId: payload.appointmentId || null,
    file: req.file,
    description: payload.description,
  })

  return res.status(201).json(successResponse('Report uploaded', { report, fileUrl }))
})

