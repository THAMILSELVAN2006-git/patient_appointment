import env from '../config/env.js'
import { UserModel, AppointmentModel } from '../models/index.js'

function daysAgoMs(days) {
  return Date.now() - days * 24 * 60 * 60 * 1000
}

export async function getAnalytics() {
  const appointments = await AppointmentModel.listAllAppointments()
  const users = await UserModel.listUsers()

  const totalAppointments = appointments.length
  const appointmentsByStatus = appointments.reduce(
    (acc, a) => {
      acc[a.status] = (acc[a.status] || 0) + 1
      return acc
    },
    { Scheduled: 0, Completed: 0, Cancelled: 0 },
  )

  const activeUsers = users.filter((u) => {
    if (!u.lastLoginAt) return false
    return new Date(u.lastLoginAt).getTime() >= daysAgoMs(30)
  }).length

  const cutoff = daysAgoMs(30)
  const doctorUsers = await UserModel.listDoctors()

  const doctorWorkload = doctorUsers.map((doc) => {
    const appts = appointments.filter(
      (a) =>
        a.doctorId === doc.id &&
        new Date(a.startTime).getTime() >= cutoff &&
        a.status !== 'Cancelled',
    )
    const upcoming = appts.filter((a) => new Date(a.startTime).getTime() >= Date.now()).length
    return {
      doctorId: doc.id,
      doctorName: doc.name,
      workload30Days: appts.length,
      upcomingCount: upcoming,
    }
  })

  return {
    totalAppointments,
    appointmentsByStatus,
    activeUsers,
    doctorWorkload,
  }
}

