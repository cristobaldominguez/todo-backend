import pool from '../pool.js'

async function read_todos(board_id) {
  const query = {
    text: `SELECT id, content, done, board_id, active FROM todos WHERE active = true AND board_id = $1 order by id`,
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

async function read_todo(id) {
  const query = {
    text: `SELECT id, content, done FROM todos WHERE id = $1 AND active = true `,
    values: [id]
  }

  try {
    const result = await pool.query(query)
    return result.rows[0]

  } catch (e) {
    console.error(e)
    return e
  }
}

async function create_todo({ content, done, board_id }) {
  const query = {
    text: `INSERT INTO todos (content, done, board_id) VALUES ($1, $2, $3) RETURNING *`,
    values: [content, done, board_id]
  }

  try {
    const result = await pool.query(query)
    return result.rows[0]

  } catch (e) {
    console.error(e)
    return e
  }
}

async function update_todo({ id, content, done }) {
  const query = {
    text: `UPDATE todos SET content = $2, done = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
    values: [id, content, done]
  }

  try {
    const result = await pool.query(query)
    return result.rows

  } catch (e) {
    console.error(e)
    return e
  }
}

async function destroy_todo(id) {
  const query = {
    text: `UPDATE todos SET active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
    values: [id]
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
  read_todo,
  read_todos,
  create_todo,
  update_todo,
  destroy_todo
}
