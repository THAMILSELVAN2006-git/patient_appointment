import Joi from 'joi'
import asyncHandler from '../middleware/asyncHandler.js'
import { validateJoi } from '../utils/validators.js'
import { successResponse } from '../utils/response.js'
import AppError from '../utils/AppError.js'
import { UserModel } from '../models/index.js'
import {
  bookAppointment,
  rescheduleAppointment,
  cancelAppointment,
  listByPatient,
  listByDoctor,
  listAll,
  updateAppointmentStatus,
} from '../services/appointmentService.js'

const bookSchema = Joi.object({
  doctorId: Joi.string().required(),
  date: Joi.string().required(),
  time: Joi.string().required(),
})

export const book = asyncHandler(async (req, res) => {
  const payload = validateJoi(bookSchema, req.body)
  const appointment = await bookAppointment({
    patientId: req.user.id,
    doctorId: payload.doctorId,
    date: payload.date,
    time: payload.time,
  })
  return res.status(201).json(successResponse('Appointment booked', { appointment }))
})

const rescheduleSchema = Joi.object({
  date: Joi.string().required(),
  time: Joi.string().required(),
})

export const reschedule = asyncHandler(async (req, res) => {
  if (req.user.role !== 'patient') throw new AppError('Forbidden', 403)
  const payload = validateJoi(rescheduleSchema, req.body)

  const appointment = await rescheduleAppointment({
    patientId: req.user.id,
    appointmentId: req.params.id,
    date: payload.date,
    time: payload.time,
  })

  return res.status(200).json(successResponse('Appointment rescheduled', { appointment }))
})

export const cancel = asyncHandler(async (req, res) => {
  const appointmentId = req.params.id
  const appointment = await cancelAppointment({
    actorUserId: req.user.id,
    actorRole: req.user.role,
    appointmentId,
  })
  return res.status(200).json(successResponse('Appointment cancelled', { appointment }))
})

export const list = asyncHandler(async (req, res) => {
  if (req.user.role === 'patient') {
    const appointments = await listByPatient(req.user.id)
    return res.status(200).json(successResponse('Appointments fetched', { appointments }))
  }

  if (req.user.role === 'doctor') {
    const appointments = await listByDoctor(req.user.id)
    return res.status(200).json(successResponse('Appointments fetched', { appointments }))
  }

  if (req.user.role === 'admin') {
    const appointments = await listAll()
    return res.status(200).json(successResponse('Appointments fetched', { appointments }))
  }

  throw new AppError('Forbidden', 403)
})

export const listPatientAppointments = asyncHandler(async (req, res) => {
  const appointments = await listByPatient(req.user.id)
  const doctorIds = [...new Set(appointments.map((a) => a.doctorId).filter(Boolean))]
  const doctorEntries = await Promise.all(
    doctorIds.map(async (id) => {
      const user = await UserModel.findUserById(id)
      return [id, user?.name || null]
    }),
  )
  const doctorMap = new Map(doctorEntries)
  const enriched = appointments.map((a) => ({
    ...a,
    doctorName: doctorMap.get(a.doctorId) || null,
  }))
  return res.status(200).json(successResponse('Patient appointments fetched', { appointments: enriched }))
})

export const listDoctorAppointments = asyncHandler(async (req, res) => {
  const appointments = await listByDoctor(req.user.id)
  const patientIds = [...new Set(appointments.map((a) => a.patientId).filter(Boolean))]
  const patientEntries = await Promise.all(
    patientIds.map(async (id) => {
      const user = await UserModel.findUserById(id)
      return [id, user?.name || null]
    }),
  )
  const patientMap = new Map(patientEntries)
  const enriched = appointments.map((a) => ({
    ...a,
    patientName: patientMap.get(a.patientId) || null,
  }))
  return res.status(200).json(successResponse('Doctor appointments fetched', { appointments: enriched }))
})

const updateStatusSchema = Joi.object({
  status: Joi.string().valid('approved', 'rejected').required(),
})

export const updateStatus = asyncHandler(async (req, res) => {
  const payload = validateJoi(updateStatusSchema, req.body)
  const appointment = await updateAppointmentStatus({
    appointmentId: req.params.id,
    doctorId: req.user.id,
    status: payload.status,
  })
  return res.status(200).json(successResponse('Appointment status updated', { appointment }))
})

