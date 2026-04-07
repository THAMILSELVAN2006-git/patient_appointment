import crypto from 'crypto'

export function createId(prefix) {
  return `${prefix}_${crypto.randomUUID()}`
}

// Simple in-memory stores for dev/testing.
// In production, swap these model implementations with DB-backed ones.
export const memoryDb = {
  users: new Map(),
  appointments: new Map(),
  medicalReports: new Map(),
  diagnoses: new Map(),
  prescriptions: new Map(),
  notifications: [], // {id, type, userId, appointmentId, createdAt, message}
}

