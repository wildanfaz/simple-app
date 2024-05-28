const ctrl = {}
import models from '../models/users.js'
import { response, http } from '../helpers/response.js'
import validator from 'validator'
import { isAlphaSpace } from '../helpers/utils.js'
import { hashPassword, comparePassword } from '../helpers/hash.js'
import { logger } from '../helpers/logger.js'
import { generateToken } from '../helpers/jwt.js'

ctrl.Register = async (req, res) => {
    try {
        const { full_name, job_title, email, password } = req.body

        if (!full_name || !email || !password || !job_title) {
            logger.error('Please fill all fields')
            return response(res, http.STATUS_BAD_REQUEST, 'Please fill all fields', true)
        }

        if (!validator.isEmail(email)) {
            logger.error('Invalid email')
            return response(res, http.STATUS_BAD_REQUEST, 'Invalid email', true)
        }

        if (validator.isStrongPassword(password, { minLength: 6 })) {
            logger.error('Password must be at least 6 characters')
            return response(res, http.STATUS_BAD_REQUEST, 'Password must be at least 6 characters', true)
        }

        if (!isAlphaSpace(full_name)) {
            logger.error('Fullname must be alpha space')
            return response(res, http.STATUS_BAD_REQUEST, 'Fullname must be alpha space', true)
        }

        if (!isAlphaSpace(job_title)) {
            logger.error('Job title must be alpha space')
            return response(res, http.STATUS_BAD_REQUEST, 'Job title must be alpha space', true)
        }

        const user = await models.GetUserByEmail(email)
        if (user.length > 0) {
            logger.error('Email already registered')
            return response(res, http.STATUS_BAD_REQUEST, 'Email already registered', true)
        }

        const hashedPassword = await hashPassword(password)
        const data = await models.Register({ full_name, job_title, email, hashedPassword })
        logger.info('Register success')
        return response(res, http.STATUS_OK, data)
    } catch (error) {
        logger.error([error])
        return response(res, http.STATUS_INTERNAL_SERVER_ERROR, 'Register failed', true)
    }
}

ctrl.Login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            logger.error('Please fill all fields')
            return response(res, http.STATUS_BAD_REQUEST, 'Please fill all fields', true)
        }

        if (!validator.isEmail(email)) {
            logger.error('Invalid email')
            return response(res, http.STATUS_BAD_REQUEST, 'Invalid email', true)
        }

        const user = await models.GetUserByEmail(email)
        if (user.length < 1) {
            logger.error('Email not registered')
            return response(res, http.STATUS_BAD_REQUEST, 'Incorrect email or password', true)
        }

        const result = await comparePassword(password, user[0].password)
        if (!result) {
            logger.error('Incorrect password')
            return response(res, http.STATUS_BAD_REQUEST, 'Incorrect email or password', true)
        }

        const token = generateToken({ email: email, role: user[0].role })

        logger.info('Login success')
        return response(res, http.STATUS_OK, {token: token})
    } catch (error) {
        logger.error([error])
        return response(res, http.STATUS_INTERNAL_SERVER_ERROR, 'Login failed', true)
    }
}

ctrl.GetProfile = async (req, res) => {
    try {
        const user = await models.GetUserByEmail(req.user.email)
        if (user.length < 1) {
            logger.error('Email not registered')
            return response(res, http.STATUS_BAD_REQUEST, 'Email not registered', true)
        }

        logger.info('Get profile success')
        return response(res, http.STATUS_OK, {
            full_name: user[0].full_name,
            job_title: user[0].job_title,
            email: user[0].email,
            created_at: user[0].created_at,
            updated_at: user[0].updated_at
        })
    } catch (error) {
        logger.error([error])
        return response(res, http.STATUS_INTERNAL_SERVER_ERROR, 'Get profile failed', true)
    }
}

ctrl.GetUsers = async (req, res) => {
    try {
        const { name, job_title, per_page, page } = req.query

        const data = await models.GetUsers({ name, job_title, per_page, page })

        logger.info('Get users success')
        return response(res, http.STATUS_OK, data)
    } catch (error) {
        logger.error([error])
        return response(res, http.STATUS_INTERNAL_SERVER_ERROR, 'Get users failed', true)
    }
}

ctrl.FindOne = async (req, res) => {
    try {
        const { id } = req.params
        const data = await models.FindOne(id)

        logger.info('Find one success')
        return response(res, http.STATUS_OK, data)
    } catch (error) {
        logger.error([error])
        return response(res, http.STATUS_INTERNAL_SERVER_ERROR, 'Find one failed', true)
    }
}

ctrl.UpdateUser = async (req, res) => {
    try {
        const { full_name, job_title } = req.body

        if (!full_name && !job_title) {
            logger.error('One of the fields must be filled')
            return response(res, http.STATUS_BAD_REQUEST, 'One of the fields must be filled', true)
        }

        if (full_name) {
            if (!isAlphaSpace(full_name)) {
                logger.error('Fullname must be alpha space')
                return response(res, http.STATUS_BAD_REQUEST, 'Fullname must be alpha space', true)
            }
        }

        if (job_title) {
            if (!isAlphaSpace(job_title)) {
                logger.error('Job title must be alpha space')
                return response(res, http.STATUS_BAD_REQUEST, 'Job title must be alpha space', true)
            }
        }

        const data = await models.UpdateUser({ full_name, job_title, email: req.user.email })

        logger.info('Update user success')
        return response(res, http.STATUS_OK, data)
    } catch (error) {
        logger.error([error])
        return response(res, http.STATUS_INTERNAL_SERVER_ERROR, 'Update user failed', true)
    }
}

ctrl.DeleteUser = async (req, res) => {
    try {
        const data = await models.DeleteUser(req.user.email)

        logger.info('Delete user success')
        return response(res, http.STATUS_OK, data)
    } catch (error) {
        logger.error([error])
        return response(res, http.STATUS_INTERNAL_SERVER_ERROR, 'Delete user failed', true)
    }
}

export default ctrl