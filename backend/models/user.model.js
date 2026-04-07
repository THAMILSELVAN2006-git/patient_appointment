import { memoryDb, createId } from './_memoryDb.js'

function sanitizeUser(user) {
  if (!user) return null
  const { passwordHash, ...rest } = user
  return rest
}

export async function createUser({
  name,
  email,
  passwordHash,
  role,
  specialization,
  profile = {},
}) {
  const id = createId('user')

  const user = {
    id,
    name,
    email: email.toLowerCase(),
    passwordHash,
    role,
    specialization: specialization || null,
    profile,
    lastLoginAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  memoryDb.users.set(id, user)
  return sanitizeUser(user)
}

export async function findUserByEmail(email) {
  if (!email) return null
  const needle = email.toLowerCase()
  for (const user of memoryDb.users.values()) {
    if (user.email === needle) return sanitizeUser(user)
  }
  return null
}

export async function findUserByEmailWithPassword(email) {
  if (!email) return null
  const needle = email.toLowerCase()
  for (const user of memoryDb.users.values()) {
    if (user.email === needle) return user
  }
  return null
}

export async function findUserById(id) {
  if (!id) return null
  const user = memoryDb.users.get(id)
  return sanitizeUser(user)
}

export async function updateUserById(id, updates) {
  const user = memoryDb.users.get(id)
  if (!user) return null

  const next = {
    ...user,
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  memoryDb.users.set(id, next)
  return sanitizeUser(next)
}

export async function deleteUserById(id) {
  return memoryDb.users.delete(id)
}

export async function listUsers() {
  return Array.from(memoryDb.users.values()).map((u) => sanitizeUser(u))
}

export async function listDoctors() {
  return Array.from(memoryDb.users.values())
    .filter((u) => u.role === 'doctor')
    .map((u) => sanitizeUser(u))
}

export async function findUserWithRoleAndPasswordById(id) {
  if (!id) return null
  return memoryDb.users.get(id) || null
}

export function _debugGetAllUsers() {
  return Array.from(memoryDb.users.values())
}

