import pool from '../pool.js'
import AccessError from '../../errors/access_error.js'
import ContentError from '../../errors/content_error.js'

async function read_boards({ user_id }) {
  const query = {
    text: `SELECT id, name, icon, colour FROM boards WHERE active = true AND user_id = $1 order by id`,
    values: [user_id]
  }

  try {
    const result = await pool.query(query)
    return result.rows

  } catch (e) {
    console.error(e)
    return new Error(e.message)
  }
}

async function read_board({ id, user_id }) {
  const query = {
    text: `SELECT id, name, icon, colour FROM boards WHERE id = $1 AND user_id = $2 AND active = true `,
    values: [id, user_id]
  }

  const if_exists = {
    text: `SELECT 1 FROM boards WHERE id = $1 AND active = true`,
    values: [id]
  }

  try {
    const exists = await pool.query(if_exists)
    if (!Boolean(exists.rowCount)) throw new AccessError({ message: 'Board Not Found.', status: 403 })

    const result = await pool.query(query)
    if (result.rows.length < 1) throw new AccessError({ message: 'Have no access to this board.', status: 403 })

    return result.rows[0]

  } catch (e) {
    console.error(e)
    return e
  }
}

async function create_board({ name, icon, colour, user_id }) {
  const query = {
    text: `INSERT INTO boards (name, icon, colour, user_id) VALUES ($1, $2, $3, $4) RETURNING id, name, icon, colour`,
    values: [name, icon, colour, user_id]
  }

  try {
    const result = await pool.query(query)
    return result.rows[0]

  } catch (e) {
    if (e.code === '22001') return new ContentError({ message: e.message })

    console.error(e)
    return e
  }
}

async function update_board({ id, name, icon, colour }) {
  const query = {
    text: `UPDATE boards SET name = $2, icon = $3, colour = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id, name, icon, colour`,
    values: [id, name, icon, colour]
  }

  try {
    const result = await pool.query(query)
    return result.rows

  } catch (e) {
    console.error(e)
    if (e.code === '22001') return new ContentError({ message: e.message })

    return e
  }
}

async function destroy_board({ id, user_id }) {
  const query = {
    text: `UPDATE boards SET active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND user_id = $2 RETURNING id, name, icon, colour`,
    values: [id, user_id]
  }

  const if_exists = {
    text: `SELECT 1 FROM boards WHERE id = $1 AND active = true`,
    values: [id]
  }

  try {
    const exists = await pool.query(if_exists)
    if (!Boolean(exists.rowCount)) throw new AccessError({ message: 'Board Not Found.', status: 403 })

    const result = await pool.query(query)
    if (result.rows.length < 1) throw new AccessError({ message: 'Have no access to this board.', status: 403 })

    return result.rows[0]

  } catch (e) {
    console.error(e)
    return e
  }
}

export {
  read_board,
  read_boards,
  create_board,
  update_board,
  destroy_board
}
