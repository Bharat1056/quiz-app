 // In javascript There is an already Error class defined but we want to override this class and make our own version of this

 // That's why we use extends keyword
class apiError extends Error {
    constructor(
        statusCode,
        message = "Something Went wrong",
        errors = [],
        stack = ""
    ) {
        super(message)
        this.statusCode = statusCode
        this.message = message
        this.data = null
        this.success = false
        this.errors = errors
        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export default apiError 