import dotenv from 'dotenv'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

// dotEnv Config
dotenv.config()

const email_regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g

const redirect = {
  after: {
    login: '/',
    logout: '/',
    signup: '/',
  },
  for_unauthorized: '/auth/login'
}

const env_db_config = JSON.parse(process.env.DB_CONFIG)

const port = process.env.PORT || 3000
const host = process.env.HOST || 'localhost'
const root = dirname(fileURLToPath(import.meta.url))
const db_default_options = {
  host: process.env.DB_HOST || 'localhost',
  // user: 'pg_username',
  // password: 'pg_password',
  // database: 'db_name',
  port: Number(process.env.DB_PORT) || 5432
}

const whitelist = [undefined, 'http://localhost:8080']
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

const db = { ...db_default_options, ...env_db_config }

export { port, root, db, redirect, email_regex, corsOptions, host }
