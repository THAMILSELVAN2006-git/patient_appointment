import mongoose from 'mongoose'

const PrescriptionSchema = new mongoose.Schema(
  {
    appointmentId: { type: String },
    doctorId: { type: String },
    patientId: { type: String },
    medications: { type: Array, default: [] },
    notes: { type: String, default: null },
    createdAt: { type: String },
  },
  { strict: false, versionKey: false },
)

const Prescription = mongoose.models.Prescription || mongoose.model('Prescription', PrescriptionSchema)

function toPayload(doc) {
  if (!doc) return null
  const obj = doc.toObject()
  const { _id, ...rest } = obj
  return { id: _id.toString(), ...rest }
}

export async function createPrescription({ appointmentId, doctorId, patientId, medications = [], notes = null }) {
  const doc = await Prescription.create({
    appointmentId,
    doctorId,
    patientId,
    medications,
    notes: notes || null,
    createdAt: new Date().toISOString(),
  })
  return toPayload(doc)
}

export async function listPrescriptionsByAppointment(appointmentId) {
  const docs = await Prescription.find({ appointmentId })
  return docs.map((d) => toPayload(d))
}

