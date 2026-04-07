export function successResponse(message, data) {
  return { success: true, message, data: data ?? {} }
}

export function failureResponse(message, data) {
  return { success: false, message, data: data ?? {} }
}

