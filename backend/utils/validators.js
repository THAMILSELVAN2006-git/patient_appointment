import AppError from './AppError.js'

export function validateJoi(schema, payload) {
  const { error, value } = schema.validate(payload, {
    abortEarly: false,
    stripUnknown: true,
  })
  if (error) {
    throw new AppError('Validation error', 400, error.details)
  }
  return value
}

