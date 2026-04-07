function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n))
}

export function inferSeverity({ severity, symptoms } = {}) {
  if (typeof severity === 'number' && Number.isFinite(severity)) return clamp(severity, 1, 5)

  const text = Array.isArray(symptoms) ? symptoms.join(' ').toLowerCase() : ''

  const high = [
    'chest pain',
    'severe bleeding',
    'unconscious',
    'stroke',
    'difficulty breathing',
    'severe shortness of breath',
  ]
  const medium = ['fever', 'severe cough', 'abdominal pain', 'vomiting', 'dehydration']
  const low = ['mild headache', 'fatigue', 'sore throat']

  const hit = (arr) => arr.some((k) => text.includes(k))
  if (hit(high)) return 5
  if (hit(medium)) return 3
  if (hit(low)) return 1
  return 2
}

export function calculatePriority({ severity, symptoms } = {}) {
  const sev = inferSeverity({ severity, symptoms })

  // Rule-based scoring that frontend can still interpret (e.g. sorting).
  const priorityScore = 1000 + sev * 250
  const priorityLevel = sev >= 4 ? 'high' : sev === 3 ? 'medium' : 'low'

  return { severity: sev, priorityScore, priorityLevel }
}

