import mongoose from 'mongoose'

const MedicalRecordSchema = new mongoose.Schema(
  {
    patientId: { type: String, required: true, index: true },
    doctorId: { type: String, required: true, index: true },
    appointmentId: { type: String, required: true, index: true },
    diagnosis: { type: String, required: true },
    notes: { type: String, default: '' },
    prescription: { type: String, default: '' },
    date: { type: String, required: true },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  { strict: false, versionKey: false },
)

const MedicalRecord =
  mongoose.models.MedicalRecord || mongoose.model('MedicalRecord', MedicalRecordSchema)

function toPayload(doc) {
  if (!doc) return null
  const obj = doc.toObject()
  const { _id, ...rest } = obj
  return { id: _id.toString(), ...rest }
}

export async function createMedicalRecord(payload) {
  const doc = await MedicalRecord.create(payload)
  return toPayload(doc)
}

export async function listMedicalRecordsByPatient(patientId) {
  const docs = await MedicalRecord.find({ patientId }).sort({ date: -1 })
  return docs.map((d) => toPayload(d))
}

