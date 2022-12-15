// Import Queries
import { read_todos, read_todo, create_todo, update_todo, destroy_todo } from '../db/queries/todos.js'

async function get_todos(board_id) {
  return await read_todos(board_id)
}

async function get_todo(id, user_id) {
  return await read_todo(id, user_id)
}

async function post_todo({ content, done = false, board_id }) {
  try {
    return await create_todo({ content, done, board_id })

  } catch (error) {
    
  }
}

async function put_todo({ id, content, done }) {
  
  try {
    const todo = await read_todo(id)
    const new_todo = { 
      ...todo,
      content: content !== undefined ? content : todo.content,
      done: done !== undefined ? done : todo.done
    }

    return await update_todo(new_todo)

  } catch (error) {
    
  }
}

async function delete_todo(id) {
  try {
    return await destroy_todo(id)
    
  } catch (error) {
    
  }
}

export default {
  get_todo,
  get_todos,
  post_todo,
  put_todo,
  delete_todo
}
