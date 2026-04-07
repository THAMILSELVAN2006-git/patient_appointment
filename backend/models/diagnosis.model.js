import { memoryDb, createId } from './_memoryDb.js'

export async function createDiagnosis({
  appointmentId,
  doctorId,
  patientId,
  diagnosisText,
  symptoms = [],
  severity,
}) {
  const id = createId('dx')
  const diagnosis = {
    id,
    appointmentId,
    doctorId,
    patientId,
    diagnosisText,
    symptoms,
    severity: typeof severity === 'number' ? severity : null,
    createdAt: new Date().toISOString(),
  }

  memoryDb.diagnoses.set(id, diagnosis)
  return diagnosis
}

export async function listDiagnosesByAppointment(appointmentId) {
  return Array.from(memoryDb.diagnoses.values()).filter((d) => d.appointmentId === appointmentId)
}

