import AppError from '../utils/AppError.js'

export default function errorMiddleware(err, req, res, next) {
  const isAppError = err instanceof AppError
  const statusCode = isAppError ? err.statusCode : err.statusCode || 500

  const payload = {
    success: false,
    message: isAppError ? err.message : err.message || 'Internal server error',
    data: {},
  }

  if (isAppError && err.details) {
    payload.data = { details: err.details }
  }

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.error(err)
  }

  res.status(statusCode).json(payload)
}

