import 'dotenv/config'
import { pool } from '../src/config/db.js'
import { hashPassword } from '../src/helpers/hash.js'

async function dumy() {
    for (let i = 0; i < 0; i++) {
        try {
            await pool.connect()
            break
        } catch (error) {
            console.log(error)
            setTimeout(null, 1500)
        }
    }
    const password = await hashPassword('admin')
    pool.query('INSERT INTO users (full_name, job_title, role, email, password) VALUES ($1, $2, $3, $4, $5)', 
    ['Admin', 'Software Engineer', 'admin', 'foo@bar.com', password])
    .then(() => {
        console.log('Dumy success')
        process.exit()
    })
    .catch((err) => {
        console.log(err)
        process.exit()
    })
}

dumy()