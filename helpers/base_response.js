export const responseBody = (code, message, data = '') => {
    if(!data) return { code, message}
    return { code, message, data }
}