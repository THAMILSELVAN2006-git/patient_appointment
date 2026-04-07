import AppError from '../utils/AppError.js'
import { MedicalReportModel, AppointmentModel } from '../models/index.js'

export async function createMedicalReportForPatient({
  patientId,
  appointmentId,
  file,
  description,
}) {
  if (!file) throw new AppError('File is required', 400)

  if (appointmentId) {
    const appt = await AppointmentModel.findAppointmentById(appointmentId)
    if (!appt) throw new AppError('Appointment not found', 404)
    if (appt.patientId !== patientId) throw new AppError('Forbidden: appointment not belongs to patient', 403)
  }

  const report = await MedicalReportModel.createMedicalReport({
    patientId,
    appointmentId,
    filePath: file.path,
    fileType: file.mimetype,
    originalName: file.originalname,
    description,
  })

  // Frontend-friendly path (we serve uploads statically from /uploads)
  const fileUrl = `/uploads/${file.filename}`
  return { report, fileUrl }
}

