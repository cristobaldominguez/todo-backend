import pool from '../pool.js'

// ErrorHandling
import AccessError from '../../errors/access_error.js'
import ContentError from '../../errors/content_error.js'

async function read_todos({ board_id }) {
  const query = {
    text: `SELECT id, content, done, board_id, sort FROM todos WHERE active = true AND board_id = $1 order by sort`,
    values: [board_id]
  }

  try {
    const result = await pool.query(query)
    return result.rows

  } catch (e) {
    console.error(e)
    return e
  }
}

async function read_todo({ id }) {
  const query = {
    text: `SELECT id, content, done, sort FROM todos WHERE id = $1 AND active = true `,
    values: [id]
  }

  try {
    const result = await pool.query(query)
    if (result.rows.length < 1) throw new AccessError({ message: 'ToDo Not Found.', status: 404 })

    return result.rows[0]

  } catch (e) {
    console.error(e)
    return e
  }
}

async function create_todo({ content, done, sort, board_id }) {
  const query = {
    text: `INSERT INTO todos (content, done, sort, board_id) VALUES ($1, $2, $3, $4) RETURNING id, content, done, sort, board_id`,
    values: [content, done, sort, board_id]
  }

  try {
    const result = await pool.query(query)
    return result.rows[0]

  } catch (e) {
    console.error(e)
    if (e.code === '22001') { return new ContentError({ message: e.message }) }

    return e
  }
}

async function update_todo({ id, content, done, sort }) {
  const query = {
    text: `UPDATE todos SET content = $2, done = $3, sort = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id, content, done, sort, board_id`,
    values: [id, content, done, sort]
  }

  try {
    const result = await pool.query(query)
    return result.rows

  } catch (e) {
    console.error(e)
    if (e.code === '22001') { return new ContentError({ message: e.message }) }

    return e
  }
}

async function destroy_todo({ id }) {
  const query = {
    text: `UPDATE todos SET active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id, content, done, sort, board_id`,
    values: [id]
  }

  const if_exists = {
    text: `SELECT 1 FROM todos WHERE id = $1 AND active = true`,
    values: [id]
  }

  try {
    const exists = await pool.query(if_exists)
    if (!Boolean(exists.rowCount)) throw new AccessError({ message: 'ToDo Not Found.', status: 404 })

    const result = await pool.query(query)
    return result.rows[0]

  } catch (e) {
    console.error(e)
    return e
  }
}

export {
  read_todo,
  read_todos,
  create_todo,
  update_todo,
  destroy_todo
}
