// Global error shape normaliser — called by thunks via the service layer.
// Translates any Axios error into a consistent { message, status, errors } object.
export const normaliseError = (err) => {
  if (err.response) {
    const { data, status } = err.response
    return {
      message: data?.message || 'Something went wrong.',
      status,
      errors:  data?.errors  || [],
    }
  }
  if (err.request) {
    return { message: 'Network error. Please check your connection.', status: 0, errors: [] }
  }
  return { message: err.message || 'Unexpected error.', status: -1, errors: [] }
}