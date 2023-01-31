import pool from '../pool.js'

// ErrorHandling
import AuthError from '../../errors/auth_error.js'

// User Creation
async function create_user({ email, password, first_name, last_name }) {
  const query = {
    text: `INSERT INTO users (email, password, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING *`,
    values: [email, password, first_name, last_name]
  }

  try {
    const result = await pool.query(query)
    return result.rows[0]

  } catch (e) {
    // Error for already existing user
    if (e.code === '23505') { throw new AuthError({ message: 'Email already exists' }) }
    return e
  }
}

async function put_user(id, user_data) {
  const query_str = Object.entries(user_data).map(arr => `${arr[0]} = '${arr[1]}'`).join(', ')

  const query = {
    text: `UPDATE users SET ${query_str}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id, email, first_name, last_name, dark_mode`,
    values: [id]
  }

  try {
    const result = await pool.query(query)
    return result.rows[0]

  } catch (e) {
    if (e.code === '22P02') { throw new AuthError({ message: 'Boolean value is not valid' }) }
    return e
  }
}

async function get_user_by(obj) {
  // Maps every key/value into array of strings and then into string
  const query_str = Object.entries(obj).map(arr => `${arr[0]} = '${arr[1]}'`).join(', ')

  const query = {
    text: `SELECT * FROM users WHERE ${query_str} AND active = true `
  }

  try {
    const result = await pool.query(query)
    return result.rows[0]

  } catch (e) {
    console.error(e)
    return e
  }
}

export {
  put_user,
  create_user,
  get_user_by
}
