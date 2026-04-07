import mongoose from 'mongoose'

const MedicalReportSchema = new mongoose.Schema(
  {
    patientId: { type: String },
    appointmentId: { type: String, default: null },
    filePath: { type: String },
    fileType: { type: String },
    originalName: { type: String, default: null },
    description: { type: String, default: null },
    uploadedAt: { type: String },
  },
  { strict: false, versionKey: false },
)

const MedicalReport = mongoose.models.MedicalReport || mongoose.model('MedicalReport', MedicalReportSchema)

function toPayload(doc) {
  if (!doc) return null
  const obj = doc.toObject()
  const { _id, ...rest } = obj
  return { id: _id.toString(), ...rest }
}

export async function createMedicalReport({ patientId, appointmentId, filePath, fileType, originalName, description }) {
  const doc = await MedicalReport.create({
    patientId,
    appointmentId: appointmentId || null,
    filePath,
    fileType,
    originalName: originalName || null,
    description: description || null,
    uploadedAt: new Date().toISOString(),
  })
  return toPayload(doc)
}

export async function listReportsByPatient(patientId) {
  const docs = await MedicalReport.find({ patientId })
  return docs.map((d) => toPayload(d))
}

export async function listReportsByAppointment(appointmentId) {
  const docs = await MedicalReport.find({ appointmentId })
  return docs.map((d) => toPayload(d))
}

export async function findReportById(id) {
  const doc = await MedicalReport.findById(id)
  return toPayload(doc)
}

