import asyncHandler from '../middleware/asyncHandler.js'
import { successResponse } from '../utils/response.js'
import { UserModel } from '../models/index.js'

export const listUsers = asyncHandler(async (req, res) => {
  const users = await UserModel.listUsers()
  return res.status(200).json(successResponse('Users fetched', { users }))
})

export const listDoctors = asyncHandler(async (req, res) => {
  const doctors = await UserModel.listDoctors()
  return res.status(200).json(successResponse('Doctors fetched', { doctors }))
})
