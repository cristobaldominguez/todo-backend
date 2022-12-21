// Import Queries
import { read_todos, read_todo, create_todo, update_todo, destroy_todo } from '../db/queries/todos.js'

// ErrorHandling
import ContentError from '../errors/content_error.js'

// Import Helpers
import { sanitize_post_board } from '../helpers/sanitization_helper.js'
import isEmpty from '../helpers/is_empty.js'

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
  const { content, done } = sanitize_post_board({req, params: req.body})

  if (!content) { throw new ContentError({ message: 'Please provide a content!' }) }

  try {
    return await create_todo({ content, done: done || false, board_id })

  } catch (error) {
    return error
  }
}

async function put_todo(req) {
  const { id } = req.params
  if (isEmpty(req.body)) { throw new ContentError({ message: "The request's body is empty, nothing to change", status: 400 }) }
  
  const { content, done } = sanitize_post_board({req, params: req.body})

  try {
    const todo = await read_todo({ id })
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
