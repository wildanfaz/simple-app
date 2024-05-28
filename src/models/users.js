const models = {}
import { pool } from '../config/db.js'

models.GetUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM users WHERE email = $1', [email])
        .then((data) => {
            resolve(data.rows)
        })
        .catch((err) => {
            reject(err)
        })
    })
}

models.Register = (data) => {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO users (full_name, job_title, email, password) VALUES ($1, $2, $3, $4)', 
        [data.full_name, data.job_title, data.email, data.hashedPassword])
        .then(() => {
            console.log([data.full_name, data.job_title, data.email, data.hashedPassword])
            resolve('Register success')
        })
        .catch((err) => {
            reject(err)
        })
    })
}

models.GetUsers = (data) => {
    return new Promise((resolve, reject) => {
        let values = []
        let query = `
        SELECT full_name, job_title FROM users 
        `
        let counter = 1

        if (data.name || data.job_title) {
            query += `WHERE `
        }

        if (data.name) {
            query += `full_name @@ to_tsquery($${counter}) AND`
            counter++
            values.push(data.name)
        }

        if (data.job_title) {
            query += `
            job_title @@ to_tsquery($${counter})`
            counter++
            values.push(data.job_title)
        } else {
            query = query.replace(' AND', '')
        }

        query += `
        ORDER BY full_name, job_title`

        let limit = 10
        if (data.per_page) {
            limit = data.per_page
        }
        values.push(limit)

        let offset = 0
        if (data.page) {
            offset = (data.page - 1) * limit
        }
        values.push(offset)

        query += `
        LIMIT $${counter} OFFSET $${counter + 1}`

        pool.query(query, values)
        .then((data) => {
            resolve(data.rows)
        })
        .catch((err) => {
            reject(err)
        })
    })
}

models.FindOne = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM users WHERE id = $1', [id])
        .then((data) => {
            resolve(data.rows)
        })
        .catch((err) => {
            reject(err)
        })
    })
}

models.UpdateUser = (data) => {
    return new Promise((resolve, reject) => {
        let query = `UPDATE users SET `
        let counter = 1
        let values = []

        if (data.full_name) {
            query += `full_name = $${counter}, `
            counter++
            values.push(data.full_name)
        }

        if (data.job_title) {
            query += `job_title = $${counter}`
            counter++
            values.push(data.job_title)
        } else {
            query = query.replace(', ', '')
        }

        query += `
        WHERE email = $${counter}`
        values.push(data.email)

        pool.query(query, values)
        .then(() => {
            resolve('Update user success')
        })
        .catch((err) => {
            reject(err)
        })
    })
}

models.DeleteUser = (email) => {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM users WHERE email = $1', [email])
        .then(() => {
            resolve('Delete user success')
        })
        .catch((err) => {
            reject(err)
        })
    })
}

export default models