// Import Queries
import { read_boards, read_board, create_board, update_board, destroy_board } from '../db/queries/boards.js'

// ErrorHandling
import AccessError from '../errors/access_error.js'
import ContentError from '../errors/content_error.js'

// Import helpers
import isEmpty from '../helpers/is_empty.js'
import { sanitize_post_board } from '../helpers/sanitization_helper.js'

async function get_boards(req) {
  const { id: user_id } = req.user
  try {
    return await read_boards({ user_id })
    
  } catch (error) {
    return error
  }
}

async function get_board(req) {
  const { id } = req.params
  const { id: user_id } = req.user

  try {
    const board = await read_board({ id, user_id })
    if (board.error) throw new AccessError({ message: board.error.message, status: board.error.status })

    return board

  } catch (error) {
    return error
  }
}

async function post_board(req) {
  const { id: user_id } = req.user
  const { name, icon, colour } = sanitize_post_board({req, params: req.body})

  try {
    if (!name) throw new ContentError({ message: 'Please provide a name.', status: 400 })
    if (!icon) throw new ContentError({ message: 'Please provide a icon.', status: 400 })
    if (!colour) throw new ContentError({ message: 'Please provide a colour.', status: 400 })

    return await create_board({ name, icon, colour, user_id })

  } catch (error) {
    return error
  }
}

async function put_board(req) {
  const { id } = req.params
  const { id: user_id } = req.user

  if (isEmpty(req.body)) { throw new ContentError({ message: "The request's body is empty, nothing to change", status: 400 }) }

  const { name, icon, colour } = sanitize_post_board({req, params: req.body})

  try {
    const board = await read_board(id, user_id)
    if (board.is_an_error) return board

    const new_board = { 
      ...board,
      name: name !== undefined ? name : board.name,
      icon: icon !== undefined ? icon : board.icon,
      colour: colour !== undefined ? colour : board.colour
    }

    return await update_board(new_board)

  } catch (error) {
    return error
  }
}

async function delete_board(req) {
  const { id } = req.params
  const { id: user_id } = req.user
  
  try {
    if (!id) throw new AccessError({ message: 'Please provide a board id!', status: 400 })

    return await destroy_board({ id, user_id })

  } catch (error) {
    return error
  }
}

export default {
  get_board,
  get_boards,
  post_board,
  put_board,
  delete_board
}
