import 'dotenv/config'
import express, { json } from 'express'
const server = express()
import main from './src/main.js'
import { pool } from './src/config/db.js'

async function init() {
    try {
        for (let i = 0; i < 0; i++) {
            try {
                await pool.connect()
                break
            } catch (error) {
                console.log(error)
                setTimeout(null, 1500)
            }
        }
        server.use(json())
        server.use('/api/v1', main)
        server.listen(process.env.APP_PORT, () => {
            console.log('Server running on port ' + process.env.APP_PORT)
        })
    } catch (error) {
        console.log(error)
    }
}

init()