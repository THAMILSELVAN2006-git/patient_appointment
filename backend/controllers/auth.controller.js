import Joi from 'joi'
import asyncHandler from '../middleware/asyncHandler.js'
import { authRateLimiter } from '../middleware/rateLimit.js'
import { validateJoi } from '../utils/validators.js'
import { successResponse } from '../utils/response.js'
import { register as registerService, login as loginService, getProfile } from '../services/authService.js'

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(120).required(),
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().min(8).max(200).required(),
  role: Joi.string().valid('patient', 'doctor', 'admin').optional(),
  profile: Joi.object().optional(),
})

const loginSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().min(1).required(),
})

export const register = asyncHandler(async (req, res) => {
  const payload = validateJoi(registerSchema, req.body)
  const user = await registerService(payload)
  return res.status(201).json(successResponse('Registered successfully', { user }))
})

export const login = asyncHandler(async (req, res) => {
  const payload = validateJoi(loginSchema, req.body)
  const result = await loginService(payload)
  return res.status(200).json(successResponse('Login successful', result))
})

export const profile = asyncHandler(async (req, res) => {
  const user = await getProfile(req.user.id)
  return res.status(200).json(successResponse('Profile fetched', { user }))
})

