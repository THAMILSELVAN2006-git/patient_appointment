import { memoryDb, createId } from './_memoryDb.js'

function toIsoDate(d) {
  const dt = d instanceof Date ? d : new Date(d)
  if (Number.isNaN(dt.getTime())) return null
  return dt.toISOString()
}

function toMs(isoOrDate) {
  const dt = isoOrDate instanceof Date ? isoOrDate : new Date(isoOrDate)
  return dt.getTime()
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

  const id = createId('appt')
  const appointment = {
    id,
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
  }

  memoryDb.appointments.set(id, appointment)
  return appointment
}

export async function findAppointmentById(id) {
  return memoryDb.appointments.get(id) || null
}

export async function listAppointmentsByPatient(patientId) {
  return Array.from(memoryDb.appointments.values())
    .filter((a) => a.patientId === patientId)
    .sort((a, b) => toMs(a.startTime) - toMs(b.startTime))
}

export async function listAppointmentsByDoctor(doctorId) {
  return Array.from(memoryDb.appointments.values())
    .filter((a) => a.doctorId === doctorId)
    .sort((a, b) => toMs(a.startTime) - toMs(b.startTime))
}

export async function listAllAppointments() {
  return Array.from(memoryDb.appointments.values()).sort((a, b) => toMs(a.startTime) - toMs(b.startTime))
}

export async function updateAppointmentById(id, updates) {
  const existing = memoryDb.appointments.get(id)
  if (!existing) return null
  const next = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  memoryDb.appointments.set(id, next)
  return next
}

export async function deleteAppointmentById(id) {
  return memoryDb.appointments.delete(id)
}

export async function cancelAppointment(id) {
  return updateAppointmentById(id, { status: 'rejected' })
}

export async function markAppointmentCompleted(id) {
  return updateAppointmentById(id, { status: 'Completed' })
}

export async function findOverlappingAppointment({
  doctorId,
  startTime,
  endTime,
  excludingId,
}) {
  const newStartMs = toMs(startTime)
  const newEndMs = toMs(endTime)
  if (Number.isNaN(newStartMs) || Number.isNaN(newEndMs)) return null

  for (const appt of memoryDb.appointments.values()) {
    if (appt.doctorId !== doctorId) continue
    if (excludingId && appt.id === excludingId) continue
    if (!['pending', 'approved'].includes(appt.status)) continue

    const apptStartMs = toMs(appt.startTime)
    const apptEndMs = toMs(appt.endTime)

    // Overlap check for time intervals.
    if (apptStartMs < newEndMs && newStartMs < apptEndMs) {
      return appt
    }
  }
  return null
}

