import { memoryDb } from '../models/_memoryDb.js'

function logNotification(type, userId, appointmentId, message) {
  // eslint-disable-next-line no-console
  console.log(`[Notification:${type}] user=${userId ?? 'n/a'} appt=${appointmentId ?? 'n/a'} - ${message}`)

  memoryDb.notifications.push({
    id: `notif_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    type,
    userId: userId ?? null,
    appointmentId: appointmentId ?? null,
    message,
    createdAt: new Date().toISOString(),
  })
}

export async function sendAppointmentConfirmation({ appointment, patient, doctor }) {
  logNotification(
    'APPOINTMENT_CONFIRMATION',
    patient?.id,
    appointment?.id,
    `Appointment confirmed for ${new Date(appointment.startTime).toLocaleString()} with Dr. ${doctor?.name || 'Doctor'}.`,
  )
}

export async function scheduleReminder({ appointment, patient }) {
  // Simulated reminder: production would enqueue a job (BullMQ/cron/etc).
  logNotification(
    'APPOINTMENT_REMINDER',
    patient?.id,
    appointment?.id,
    `Reminder scheduled for ${new Date(appointment.startTime).toLocaleString()}.`,
  )
}

export async function listNotifications() {
  return memoryDb.notifications.slice().reverse()
}

