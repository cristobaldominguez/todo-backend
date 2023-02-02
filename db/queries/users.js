import pool from '../pool.js'

// ErrorHandling
import AuthError from '../../errors/auth_error.js'

// User Creation
async function create_user({ email, password, first_name, last_name, filename = 'default', extension = 'jpg' }) {
  const query = {
    text: `WITH data(email, password, first_name, last_name) AS ( VALUES($1, $2, $3, $4) ), new_user AS ( INSERT INTO users(email, password, first_name, last_name) SELECT d.email, d.password, d.first_name, d.last_name FROM data d RETURNING email, password, first_name, last_name, id AS user_id ), new_photo AS ( INSERT INTO photos(user_id, filename, extension) SELECT user_id, $5, $6 FROM new_user RETURNING user_id, filename, extension, id ) SELECT * FROM new_user, new_photo`,
    values: [email, password, first_name, last_name, filename, extension]
  }

  try {
    const result = await pool.query(query)
    return result.rows[0]

  } catch (e) {
    // Error for already existing user
    if (e.code === '23505') { throw new AuthError({ message: 'Email already exists' }) }
    console.log(e)
    return e
  }
}

async function put_user(id, user_data) {
  const entries = Object.entries(user_data)
  const query_str = entries.map(arr => `${arr[0]} = '${arr[1]}'`).join(', ')

  const query = {
    text: `UPDATE users SET ${query_str}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id, email, first_name, last_name, dark_mode`,
    values: [id]
  }

  try {
    await pool.query(query)
    const user = await get_user_by({ id })
    return user

  } catch (e) {
    if (e.code === '22P02') { throw new AuthError({ message: 'Boolean value is not valid' }) }
    return e
  }
}

async function put_user_photo({ user_id, file_name, file_ext }) {
  const query = {
    text: `UPDATE photos SET filename = $2, extension = $3, updated_at = CURRENT_TIMESTAMP WHERE user_id = $1 RETURNING user_id, filename, extension`,
    values: [user_id, file_name, file_ext]
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
  const query_str = Object.entries(obj).map(arr => `u.${arr[0]} = '${arr[1]}'`).join(', ')

  const query = {
    text: `SELECT u.id,u.first_name,u.last_name,u.email,u.password,u.dark_mode,p.filename,p.extension FROM users AS u FULL JOIN photos AS p ON u.id = p.user_id WHERE ${query_str} AND u.active = true `
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
  get_user_by,
  put_user_photo
}
