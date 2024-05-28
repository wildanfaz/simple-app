import jwt from 'jsonwebtoken'
import { logger } from '../helpers/logger.js'
import { response, http } from '../helpers/response.js'
import models from '../models/users.js'

export const auth = (roles) => {
    return async (req, res, next) => {
        if (!req.headers.authorization) {
            logger.error('Unauthorized')
            return response(res, http.STATUS_UNAUTHORIZED, 'Authentication failed', true)
        }

        const bearer = req.headers.authorization.split(' ')[0]
        if (bearer !== 'Bearer') {
            logger.error('Unauthorized')
            return response(res, http.STATUS_UNAUTHORIZED, 'Authentication faileds', true)
        }

        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            logger.error('Unauthorized')
            return response(res, http.STATUS_UNAUTHORIZED, 'Authentication failed', true)
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            if (!roles.includes(decoded.role)) {
                logger.error('Role unauthorized')
                return response(res, http.STATUS_UNAUTHORIZED, 'Authentication failed', true)
            }

            const user = await models.GetUserByEmail(decoded.email)
            if (user.length < 1) {
                logger.error('Email not registered')
                return response(res, http.STATUS_UNAUTHORIZED, 'Authentication failed', true)
            }

            req.user = decoded
            next()
        } catch (error) {
            logger.error([error])
            return response(res, http.STATUS_UNAUTHORIZED, 'Authentication failed', true)
        }
    }
}