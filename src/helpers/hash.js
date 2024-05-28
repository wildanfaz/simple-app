import bcrypt from 'bcrypt'

export async function hashPassword(password) {
    try {
        if (password) {
            const salt = await bcrypt.genSalt(10)
            const result = await bcrypt.hash(password, salt)
            return result
        } else {
            return null
        }
    } catch (error) {
        throw error
    }
}

export async function comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword)
}