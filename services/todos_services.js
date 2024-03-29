// Import Queries
import { read_todos, read_todo, create_todo, update_todo, destroy_todo } from '../db/queries/todos.js'

// ErrorHandling
import ContentError from '../errors/content_error.js'

// Import Services
import sanitizeTodosService from './sanitize_todos_service.js'

async function get_todos(req) {
  const { board_id } = req.params

  return await read_todos({ board_id })
}

async function get_todo(req) {
  const { id } = req.params

  return await read_todo({ id })
}

async function post_todo(req) {
  const { board_id } = req.params

  try {
    const { content, done, sort } = await sanitizeTodosService(req)
    return await create_todo({ content, sort, board_id, done: done || false })

  } catch (error) {
    return error
  }
}

async function put_todo(req) {
  const { id } = req.params
  
  try {
    const { content, done, sort } = await sanitizeTodosService(req)

    const todo = await read_todo({ id })
    const new_todo = { 
      ...todo,
      content: content || todo.content,
      done: done !== undefined ? done : todo.done,
      sort: sort || todo.sort
    }

    const response = await update_todo(new_todo)
    return response[0]

  } catch (error) {
    return error
  }
}

async function delete_todo(req) {
  const { id } = req.params
  if (!id) { throw new ContentError({ message: 'Please provide a board id!' }) }

  try {
    return await destroy_todo({ id })
    
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
