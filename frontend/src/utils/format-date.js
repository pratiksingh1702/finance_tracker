import { format, parseISO } from 'date-fns'

export const formatDate = (dateString, formatStr = 'MMM dd, yyyy') => {
  if (!dateString) return ''
  try {
    return format(parseISO(dateString), formatStr)
  } catch (err) {
    return dateString
  }
}
