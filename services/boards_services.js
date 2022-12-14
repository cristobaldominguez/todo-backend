// Import Queries
import { read_boards, read_board, create_board, update_board, destroy_board } from '../db/queries/boards.js'

async function get_boards(user_id) {
  const boards = await read_boards(user_id)
  return boards
}

async function get_board(id, user_id) {
  const board = await read_board(id, user_id)
  return board
}

async function post_board({ name, icon, colour, user_id }) {
  try {
    return await create_board({ name, icon, colour, user_id })

  } catch (error) {
    
  }
}

async function put_board({ id, name, icon, colour, user_id }) {
  try {

    const board = await read_board(id, user_id)
    const new_board = { 
      ...board,
      name: name !== undefined ? name : board.name,
      icon: icon !== undefined ? icon : board.icon,
      colour: colour !== undefined ? colour : board.colour
    }
    return await update_board(new_board)

  } catch (error) {
    
  }
}

async function delete_board(id) {
  try {
    return await destroy_board(id)
    
  } catch (error) {
    
  }
}

export default {
  get_board,
  get_boards,
  post_board,
  put_board,
  delete_board
}
