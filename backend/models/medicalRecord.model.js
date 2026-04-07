import { memoryDb, createId } from './_memoryDb.js'

export async function createMedicalRecord({
  patientId,
  doctorId,
  appointmentId,
  diagnosis,
  notes,
  prescription,
  date,
}) {
  const id = createId('mr')
  const record = {
    id,
    patientId,
    doctorId,
    appointmentId,
    diagnosis,
    notes: notes || '',
    prescription: prescription || '',
    date,
    createdAt: new Date().toISOString(),
  }

  if (!memoryDb.medicalRecords) memoryDb.medicalRecords = new Map()
  memoryDb.medicalRecords.set(id, record)
  return record
}

export async function listMedicalRecordsByPatient(patientId) {
  if (!memoryDb.medicalRecords) return []
  return Array.from(memoryDb.medicalRecords.values())
    .filter((r) => r.patientId === patientId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

