export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

// min 8 chars, at least one number, lower case, upper case and special char
export const PASSWORD_PATTERN = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/

// Türkiye mobile / landline: 05XX XXX XX XX, +90 5XX..., 0 2XX...
export const isValidTurkishPhone = (value = '') => /^(\+90|0)?[2-5]\d{9}$/.test(value.replace(/[\s()-]/g, ''))

// T + 4 digits + V + 6 digits
export const TAX_NO_PATTERN = /^T\d{4}V\d{6}$/

// ISO 13616 IBAN check (mod 97)
export const isValidIban = (value = '') => {
  const iban = value.replace(/\s+/g, '').toUpperCase()
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/.test(iban)) return false
  if (iban.startsWith('TR') && iban.length !== 26) return false

  const rearranged = iban.slice(4) + iban.slice(0, 4)
  const numeric = rearranged.replace(/[A-Z]/g, (ch) => String(ch.charCodeAt(0) - 55))
  let remainder = 0
  for (const digit of numeric) {
    remainder = (remainder * 10 + Number(digit)) % 97
  }
  return remainder === 1
}

export const isValidCardNumber = (value = '') => /^\d{16}$/.test(value.replace(/\s+/g, ''))
