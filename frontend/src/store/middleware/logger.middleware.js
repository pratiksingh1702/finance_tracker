// Redux logger — only active in development
export const loggerMiddleware = (store) => (next) => (action) => {
  if (import.meta.env.DEV) {
    console.groupCollapsed(`[Redux] ${action.type}`)
    console.log('Prev state:', store.getState())
    console.log('Action:', action)
  }
  const result = next(action)
  if (import.meta.env.DEV) {
    console.log('Next state:', store.getState())
    console.groupEnd()
  }
  return result
}