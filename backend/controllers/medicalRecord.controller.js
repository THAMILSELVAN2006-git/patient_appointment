import Joi from 'joi'
import asyncHandler from '../middleware/asyncHandler.js'
import AppError from '../utils/AppError.js'
import { validateJoi } from '../utils/validators.js'
import { successResponse } from '../utils/response.js'
import { MedicalRecordModel, AppointmentModel, UserModel } from '../models/index.js'

const createSchema = Joi.object({
  appointmentId: Joi.string().required(),
  diagnosis: Joi.string().min(3).max(5000).required(),
  notes: Joi.string().max(5000).allow('', null).optional(),
  prescription: Joi.string().max(5000).allow('', null).optional(),
  date: Joi.string().required(),
})

export const createMedicalRecord = asyncHandler(async (req, res) => {
  const payload = validateJoi(createSchema, req.body)
  const appointment = await AppointmentModel.findAppointmentById(payload.appointmentId)
  if (!appointment) throw new AppError('Appointment not found', 404)
  if (appointment.doctorId !== req.user.id) {
    throw new AppError('Forbidden: cannot create record for this appointment', 403)
  }
  if (appointment.status !== 'approved') {
    throw new AppError('Medical record can be created only for approved appointments', 400)
  }

  const record = await MedicalRecordModel.createMedicalRecord({
    patientId: appointment.patientId,
    doctorId: req.user.id,
    appointmentId: payload.appointmentId,
    diagnosis: payload.diagnosis,
    notes: payload.notes || '',
    prescription: payload.prescription || '',
    date: payload.date,
  })

  return res.status(201).json(successResponse('Medical record created', { record }))
})

export const listPatientMedicalRecords = asyncHandler(async (req, res) => {
  const records = await MedicalRecordModel.listMedicalRecordsByPatient(req.user.id)
  const doctorIds = [...new Set(records.map((r) => r.doctorId).filter(Boolean))]
  const doctorEntries = await Promise.all(
    doctorIds.map(async (id) => {
      const u = await UserModel.findUserById(id)
      return [id, u?.name || null]
    }),
  )
  const doctorMap = new Map(doctorEntries)

  const data = records.map((r) => ({
    ...r,
    doctorName: doctorMap.get(r.doctorId) || null,
  }))

  return res.status(200).json(successResponse('Medical records fetched', { records: data }))
})

