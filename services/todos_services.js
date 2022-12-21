// Import Queries
import { read_todos, read_todo, create_todo, update_todo, destroy_todo } from '../db/queries/todos.js'

async function get_todos(req) {
  const { board_id } = req.params
  return await read_todos(board_id)
}

async function get_todo(req) {
  const { id } = req.params
  const { id: user_id } = req.user
  return await read_todo(id, user_id)
}

async function post_todo(req) {
  const { board_id } = req.params
  const { content, done } = req.body

  if (!content) { return res.status(400).json({ message: 'Please provide a content!' }) }

  try {
    return await create_todo({ content, done: done || false, board_id })

  } catch (error) {
    return error
  }
}

async function put_todo(req) {
  const { id } = req.params
  const { content, done } = req.body

  try {
    const todo = await read_todo(id)
    const new_todo = { 
      ...todo,
      content: content || todo.content,
      done: done !== undefined ? done : todo.done
    }

    return await update_todo(new_todo)

  } catch (error) {
    return error
  }
}

async function delete_todo(req) {
  const { id } = req.params
  if (!id) { return res.status(400).json({ message: 'Please provide a board id!' }) }

  try {
    return await destroy_todo(id)
    
  } catch (error) {
    return error
  }
}

export default {
  get_todo,
  get_todos,
  post_todo,
  put_todo,
  delete_todo
}
