import AppError from '../utils/AppError.js'

export default function roleMiddleware(allowedRoles = []) {
  return function (req, res, next) {
    const role = req.user?.role
    if (!role) throw new AppError('Forbidden: no role', 403)
    if (!allowedRoles.includes(role)) {
      throw new AppError('Forbidden: insufficient role', 403)
    }
    return next()
  }
}

