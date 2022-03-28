const successResponse = (data, message) => {
    return {
        status: 'success',
        data,
        message
    }
}

const successResponseNoData = (message) => {
    return {
        status: 'success',
        message
    }
}

const errorResponse = (message) => {
    return {
        status: 'error',
        message
    }
}

export { successResponse, errorResponse, successResponseNoData }