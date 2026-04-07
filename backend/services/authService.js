import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import env from '../config/env.js'
import AppError from '../utils/AppError.js'
import { UserModel } from '../models/index.js'

const ALLOWED_ROLES = ['patient', 'doctor', 'admin']

export async function register({ name, email, password, role = 'patient', profile }) {
  const existing = await UserModel.findUserByEmail(email)
  if (existing) throw new AppError('Email already registered', 409)

  const passwordHash = await bcrypt.hash(password, 10)

  const user = await UserModel.createUser({
    name,
    email,
    passwordHash,
    role: ALLOWED_ROLES.includes(role) ? role : 'patient',
    specialization: null,
    profile: profile || {},
  })

  return user
}

export async function createDoctorByAdmin({ name, email, password, specialization, profile }) {
  const existing = await UserModel.findUserByEmail(email)
  if (existing) throw new AppError('Email already registered', 409)

  const passwordHash = await bcrypt.hash(password, 10)

  const user = await UserModel.createUser({
    name,
    email,
    passwordHash,
    role: 'doctor',
    specialization: specialization || null,
    profile: profile || {},
  })

  return user
}

export async function login({ email, password }) {
  const user = await UserModel.findUserByEmailWithPassword(email)
  if (!user) throw new AppError('Invalid credentials', 401)

  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) throw new AppError('Invalid credentials', 401)

  await UserModel.updateUserById(user.id, { lastLoginAt: new Date().toISOString() })

  const token = jwt.sign(
    { sub: user.id, role: user.role, email: user.email },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN },
  )

  const profile = await UserModel.findUserById(user.id)
  return { token, user: profile }
}

export async function getProfile(userId) {
  const user = await UserModel.findUserById(userId)
  if (!user) throw new AppError('User not found', 404)
  return user
}

