/*
 * asyncHandler - Middleware function to handle asynchronous route handlers.
 *
 * @param {function} requestHandler - The asynchronous route handler function.
 * @returns {function} - Express middleware function.
 */
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        // Resolve the promise returned by the route handler and handle any errors
        Promise
            .resolve(requestHandler(req, res, next))
            .catch((err) => next(err));
    };
};

// Export the asyncHandler for use in other modules
export default asyncHandler;
