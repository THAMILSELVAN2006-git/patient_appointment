import asyncHandler from '../middleware/asyncHandler.js'
import { successResponse } from '../utils/response.js'
import AppError from '../utils/AppError.js'
import { UserModel, AppointmentModel, MedicalReportModel } from '../models/index.js'

export const getAppointments = asyncHandler(async (req, res) => {
  const appointments = await AppointmentModel.listAppointmentsByDoctor(req.user.id)
  return res.status(200).json(successResponse('Doctor appointments fetched', { appointments }))
})

export const getPatient = asyncHandler(async (req, res) => {
  const patientId = req.params.id
  const patient = await UserModel.findUserById(patientId)
  if (!patient) throw new AppError('Patient not found', 404)
  if (patient.role !== 'patient') throw new AppError('Not a patient', 400)

  const appointments = await AppointmentModel.listAppointmentsByPatient(patientId)
  const reports = []
  for (const a of appointments) {
    const rs = await MedicalReportModel.listReportsByAppointment(a.id)
    reports.push(...rs)
  }

  return res.status(200).json(
    successResponse('Patient record fetched', {
      patient,
      appointments,
      reports,
    }),
  )
})
