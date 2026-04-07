import mongoose from 'mongoose'

const AppointmentSchema = new mongoose.Schema(
  {
    patientId: { type: String },
    doctorId: { type: String },
    date: { type: String },
    time: { type: String },
    startTime: { type: String }, // ISO
    endTime: { type: String }, // ISO
    status: { type: String, default: 'pending' },
    priorityLevel: { type: String },
    priorityScore: { type: Number },
    symptoms: { type: Array, default: [] },
    severity: { type: Number },
  },
  { strict: false, versionKey: false },
)

const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema)

function toIsoDate(d) {
  const dt = d instanceof Date ? d : new Date(d)
  if (Number.isNaN(dt.getTime())) return null
  return dt.toISOString()
}

function toPayload(doc) {
  if (!doc) return null
  const obj = doc.toObject()
  const { _id, ...rest } = obj
  return { id: _id.toString(), ...rest }
}

export async function createAppointment({
  patientId,
  doctorId,
  date,
  time,
  startTime,
  endTime,
  status = 'pending',
  priorityLevel,
  priorityScore,
  symptoms = [],
  severity,
}) {
  const startIso = toIsoDate(startTime)
  const endIso = toIsoDate(endTime)
  if (!startIso || !endIso) throw new Error('Invalid appointment time')

  const doc = await Appointment.create({
    patientId,
    doctorId,
    date: date || null,
    time: time || null,
    startTime: startIso,
    endTime: endIso,
    status,
    priorityLevel,
    priorityScore,
    symptoms,
    severity: typeof severity === 'number' ? severity : null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })
  return toPayload(doc)
}

export async function findAppointmentById(id) {
  const doc = await Appointment.findById(id)
  return toPayload(doc)
}

function sortByStartAsc(query, items) {
  return items.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
}

export async function listAppointmentsByPatient(patientId) {
  const docs = await Appointment.find({ patientId })
  return sortByStartAsc(null, docs.map((d) => toPayload(d)))
}

export async function listAppointmentsByDoctor(doctorId) {
  const docs = await Appointment.find({ doctorId })
  return sortByStartAsc(null, docs.map((d) => toPayload(d)))
}

export async function listAllAppointments() {
  const docs = await Appointment.find({})
  return sortByStartAsc(null, docs.map((d) => toPayload(d)))
}

export async function updateAppointmentById(id, updates) {
  const nowIso = new Date().toISOString()
  const doc = await Appointment.findByIdAndUpdate(
    id,
    { ...updates, updatedAt: nowIso },
    { new: true },
  )
  return toPayload(doc)
}

export async function cancelAppointment(id) {
  return updateAppointmentById(id, { status: 'rejected' })
}

export async function markAppointmentCompleted(id) {
  return updateAppointmentById(id, { status: 'Completed' })
}

export async function findOverlappingAppointment({ doctorId, startTime, endTime, excludingId }) {
  const startIso = toIsoDate(startTime)
  const endIso = toIsoDate(endTime)
  if (!startIso || !endIso) return null

  // Overlap for intervals: existing.start < newEnd && newStart < existing.end
  const doc = await Appointment.findOne({
    doctorId,
    status: { $in: ['pending', 'approved'] },
    startTime: { $lt: endIso },
    endTime: { $gt: startIso },
    ...(excludingId ? { _id: { $ne: excludingId } } : {}),
  }).sort({ startTime: 1 })

  return toPayload(doc)
}

