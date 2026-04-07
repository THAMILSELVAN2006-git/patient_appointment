import { memoryDb, createId } from './_memoryDb.js'

export async function createMedicalReport({
  patientId,
  appointmentId,
  filePath,
  fileType,
  originalName,
  description,
}) {
  const id = createId('report')

  const report = {
    id,
    patientId,
    appointmentId: appointmentId || null,
    filePath,
    fileType,
    originalName: originalName || null,
    description: description || null,
    uploadedAt: new Date().toISOString(),
  }

  memoryDb.medicalReports.set(id, report)
  return report
}

export async function listReportsByPatient(patientId) {
  return Array.from(memoryDb.medicalReports.values()).filter((r) => r.patientId === patientId)
}

export async function listReportsByAppointment(appointmentId) {
  return Array.from(memoryDb.medicalReports.values()).filter((r) => r.appointmentId === appointmentId)
}

export async function findReportById(id) {
  return memoryDb.medicalReports.get(id) || null
}

