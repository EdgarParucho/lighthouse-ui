const networkErrMessage = 'An error ocurred. It may be a network problem.'
const defaultErrMessage = 'An error ocurred. Please try again later while we solve it.'
const networkError = (e) => e.message?.toLowerCase().includes('network')
const errorMessage = (e) => networkError(e) ? networkErrMessage : defaultErrMessage

export { errorMessage }
