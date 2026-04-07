import { memoryDb, createId } from './_memoryDb.js'

export async function createPrescription({
  appointmentId,
  doctorId,
  patientId,
  medications = [],
  notes = null,
}) {
  const id = createId('rx')
  const prescription = {
    id,
    appointmentId,
    doctorId,
    patientId,
    medications,
    notes,
    createdAt: new Date().toISOString(),
  }

  memoryDb.prescriptions.set(id, prescription)
  return prescription
}

export async function listPrescriptionsByAppointment(appointmentId) {
  return Array.from(memoryDb.prescriptions.values()).filter((p) => p.appointmentId === appointmentId)
}

