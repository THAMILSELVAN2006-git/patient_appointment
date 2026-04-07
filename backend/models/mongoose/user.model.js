import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, lowercase: true, index: true },
    passwordHash: { type: String },
    role: { type: String },
    specialization: { type: String, default: null },
    profile: { type: mongoose.Schema.Types.Mixed },
    lastLoginAt: { type: String, default: null },
    createdAt: { type: String },
    updatedAt: { type: String },
  },
  { strict: false, versionKey: false },
)

const User = mongoose.models.User || mongoose.model('User', UserSchema)

function toPayload(doc) {
  if (!doc) return null
  const obj = doc.toObject()
  const { _id, __v, ...rest } = obj
  return { id: _id.toString(), ...rest }
}

function sanitize(user) {
  if (!user) return null
  const { passwordHash, ...rest } = user
  return rest
}

export async function createUser({ name, email, passwordHash, role, specialization, profile = {} }) {
  const nowIso = new Date().toISOString()
  const doc = await User.create({
    name,
    email,
    passwordHash,
    role,
    specialization: specialization || null,
    profile,
    lastLoginAt: null,
    createdAt: nowIso,
    updatedAt: nowIso,
  })
  const payload = toPayload(doc)
  return sanitize(payload)
}

export async function findUserByEmail(email) {
  if (!email) return null
  const doc = await User.findOne({ email: email.toLowerCase() })
  return sanitize(toPayload(doc))
}

export async function findUserByEmailWithPassword(email) {
  if (!email) return null
  const doc = await User.findOne({ email: email.toLowerCase() })
  return toPayload(doc)
}

export async function findUserById(id) {
  if (!id) return null
  const doc = await User.findById(id)
  return sanitize(toPayload(doc))
}

export async function findUserWithRoleAndPasswordById(id) {
  if (!id) return null
  const doc = await User.findById(id)
  return toPayload(doc)
}

export async function updateUserById(id, updates) {
  if (!id) return null
  const nowIso = new Date().toISOString()
  const doc = await User.findByIdAndUpdate(
    id,
    { ...updates, updatedAt: nowIso },
    { new: true },
  )
  return sanitize(toPayload(doc))
}

export async function deleteUserById(id) {
  if (!id) return false
  const result = await User.deleteOne({ _id: id })
  return result.deletedCount > 0
}

export async function listUsers() {
  const docs = await User.find({})
  return docs.map((d) => sanitize(toPayload(d)))
}

export async function listDoctors() {
  const docs = await User.find({ role: 'doctor' })
  return docs.map((d) => sanitize(toPayload(d)))
}

