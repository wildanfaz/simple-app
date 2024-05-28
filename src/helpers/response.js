export const http = {
    STATUS_OK: 200,
    STATUS_BAD_REQUEST: 400,
    STATUS_UNAUTHORIZED: 401,
    STATUS_INTERNAL_SERVER_ERROR: 500,
}

export function response(res, status = 0, data = '', err = false) {
    let desc = ''

    switch (status) {
        case http.STATUS_OK:
            desc = 'OK'
            break
        case http.STATUS_BAD_REQUEST:
            desc = 'Bad Request'
            break
        case http.STATUS_UNAUTHORIZED:
            desc = 'Unauthorized'
            break
        case http.STATUS_INTERNAL_SERVER_ERROR:
            desc = 'Internal Server Error'
            break
        default:
            desc = 'Unknown'
    }

    const result = {}

    if (err === true) {
        result.status = status
        result.description = desc
        result.error = err
        result.message = data
    } else {
        result.status = status
        result.description = desc
        result.data = data
    }

    return res.status(status).json(result)
}