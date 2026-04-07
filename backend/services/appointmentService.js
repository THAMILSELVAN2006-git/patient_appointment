import AppError from '../utils/AppError.js'
import { AppointmentModel, UserModel } from '../models/index.js'
import { sendAppointmentConfirmation, scheduleReminder } from './notificationService.js'

export async function bookAppointment({
  patientId,
  doctorId,
  date,
  time,
}) {
  const doctor = await UserModel.findUserWithRoleAndPasswordById(doctorId)
  if (!doctor || doctor.role !== 'doctor') throw new AppError('Doctor not found', 404)

  const startTime = `${date}T${time}:00.000Z`
  const endTime = `${date}T${time}:59.999Z`

  const overlap = await AppointmentModel.findOverlappingAppointment({ doctorId, startTime, endTime })

  if (overlap) {
    throw new AppError('Doctor already has an appointment in that slot', 409, {
      conflictingAppointmentId: overlap.id,
    })
  }

  const appointment = await AppointmentModel.createAppointment({
    patientId,
    doctorId,
    date,
    time,
    startTime,
    endTime,
    status: 'pending',
  })

  const patient = await UserModel.findUserById(patientId)
  await sendAppointmentConfirmation({ appointment, patient, doctor })
  await scheduleReminder({ appointment, patient })

  return appointment
}

export async function rescheduleAppointment({ patientId, appointmentId, date, time }) {
  const appt = await AppointmentModel.findAppointmentById(appointmentId)
  if (!appt) throw new AppError('Appointment not found', 404)
  if (appt.patientId !== patientId) throw new AppError('Forbidden: not your appointment', 403)
  if (appt.status !== 'pending') throw new AppError('Only pending appointments can be rescheduled', 400)

  const startTime = `${date}T${time}:00.000Z`
  const endTime = `${date}T${time}:59.999Z`

  const overlap = await AppointmentModel.findOverlappingAppointment({
    doctorId: appt.doctorId,
    startTime,
    endTime,
    excludingId: appt.id,
  })

  if (overlap) throw new AppError('Doctor already has an appointment in that slot', 409)

  const updated = await AppointmentModel.updateAppointmentById(appt.id, {
    date,
    time,
    startTime,
    endTime,
    status: 'pending',
  })
  return updated
}

export async function cancelAppointment({ actorUserId, appointmentId, actorRole }) {
  const appt = await AppointmentModel.findAppointmentById(appointmentId)
  if (!appt) throw new AppError('Appointment not found', 404)

  const isOwner =
    actorRole === 'admin' ||
    (actorRole === 'patient' && appt.patientId === actorUserId) ||
    (actorRole === 'doctor' && appt.doctorId === actorUserId)

  if (!isOwner) throw new AppError('Forbidden: cannot cancel this appointment', 403)
  if (appt.status === 'rejected') return appt
  const updated = await AppointmentModel.cancelAppointment(appointmentId) // sets rejected
  return updated
}

export async function updateAppointmentStatus({ appointmentId, doctorId, status }) {
  if (!['approved', 'rejected'].includes(status)) throw new AppError('Invalid status', 400)
  const appt = await AppointmentModel.findAppointmentById(appointmentId)
  if (!appt) throw new AppError('Appointment not found', 404)
  if (appt.doctorId !== doctorId) throw new AppError('Forbidden: not your appointment', 403)
  return AppointmentModel.updateAppointmentById(appointmentId, { status })
}

export async function listByPatient(patientId) {
  return AppointmentModel.listAppointmentsByPatient(patientId)
}

export async function listByDoctor(doctorId) {
  return AppointmentModel.listAppointmentsByDoctor(doctorId)
}

export async function listAll() {
  return AppointmentModel.listAllAppointments()
}

