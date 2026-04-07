import mongoose from 'mongoose'

const DiagnosisSchema = new mongoose.Schema(
  {
    appointmentId: { type: String },
    doctorId: { type: String },
    patientId: { type: String },
    diagnosisText: { type: String },
    symptoms: { type: Array, default: [] },
    severity: { type: Number },
    createdAt: { type: String },
  },
  { strict: false, versionKey: false },
)

const Diagnosis = mongoose.models.Diagnosis || mongoose.model('Diagnosis', DiagnosisSchema)

function toPayload(doc) {
  if (!doc) return null
  const obj = doc.toObject()
  const { _id, ...rest } = obj
  return { id: _id.toString(), ...rest }
}

export async function createDiagnosis({
  appointmentId,
  doctorId,
  patientId,
  diagnosisText,
  symptoms = [],
  severity,
}) {
  const doc = await Diagnosis.create({
    appointmentId,
    doctorId,
    patientId,
    diagnosisText,
    symptoms,
    severity: typeof severity === 'number' ? severity : null,
    createdAt: new Date().toISOString(),
  })
  return toPayload(doc)
}

export async function listDiagnosesByAppointment(appointmentId) {
  const docs = await Diagnosis.find({ appointmentId })
  return docs.map((d) => toPayload(d))
}

