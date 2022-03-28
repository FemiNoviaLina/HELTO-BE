const successResponse = (data, message) => {
    return {
        status: 'success',
        data,
        message
    }
}

const errorResponse = (message) => {
    return {
        status: 'error',
        message
    }
}

export { successResponse, errorResponse }