import Joi from 'joi'
import asyncHandler from '../middleware/asyncHandler.js'
import { validateJoi } from '../utils/validators.js'
import { successResponse } from '../utils/response.js'
import { UserModel } from '../models/index.js'
import { createDoctorByAdmin } from '../services/authService.js'
import { getAnalytics } from '../services/analyticsService.js'
import AppError from '../utils/AppError.js'

const createDoctorSchema = Joi.object({
  name: Joi.string().min(2).max(120).required(),
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().min(8).max(200).required(),
  specialization: Joi.string().min(2).max(200).optional().allow(null, ''),
  profile: Joi.object().optional(),
})

export const listUsers = asyncHandler(async (req, res) => {
  const users = await UserModel.listUsers()
  return res.status(200).json(successResponse('Users fetched', { users }))
})

export const createDoctor = asyncHandler(async (req, res) => {
  const payload = validateJoi(createDoctorSchema, req.body)
  const doctor = await createDoctorByAdmin({
    name: payload.name,
    email: payload.email,
    password: payload.password,
    specialization: payload.specialization || null,
    profile: payload.profile || {},
  })

  return res.status(201).json(successResponse('Doctor created', { doctor }))
})

export const deleteUser = asyncHandler(async (req, res) => {
  const id = req.params.id
  const deleted = await UserModel.deleteUserById(id)
  if (!deleted) throw new AppError('User not found', 404)
  return res.status(200).json(successResponse('User deleted', { id }))
})

export const analytics = asyncHandler(async (req, res) => {
  const data = await getAnalytics()
  return res.status(200).json(successResponse('Analytics fetched', data))
})

