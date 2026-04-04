
export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

export const isStrongPassword = (v) =>
  v?.length >= 8 && /[A-Z]/.test(v) && /[a-z]/.test(v) && /\d/.test(v)

export const isRequired = (v) => v !== null && v !== undefined && String(v).trim() !== ''

export const isPositiveNumber = (v) => !isNaN(v) && Number(v) > 0

export const isValidObjectId = (v) => /^[a-f\d]{24}$/i.test(v)

/** Simple form validator — returns { [field]: errorMessage } */
export const validateForm = (fields) => {
  const errors = {}
  Object.entries(fields).forEach(([key, { value, rules }]) => {
    for (const rule of rules) {
      const err = rule(value)
      if (err) { errors[key] = err; break }
    }
  })
  return errors
}

export const rules = {
  required:  (msg = 'This field is required.')   => (v) => !isRequired(v) ? msg : null,
  email:     (msg = 'Enter a valid email.')       => (v) => v && !isEmail(v) ? msg : null,
  minLen:    (n, msg)  => (v) => v && v.length < n ? (msg || `Min ${n} characters.`) : null,
  maxLen:    (n, msg)  => (v) => v && v.length > n ? (msg || `Max ${n} characters.`) : null,
  positive:  (msg = 'Must be a positive number.') => (v) => v && !isPositiveNumber(v) ? msg : null,
  password:  (msg = 'Min 8 chars, uppercase, lowercase, number.') => (v) => v && !isStrongPassword(v) ? msg : null,
}