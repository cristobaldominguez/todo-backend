// Import Services
import boards_services from '../services/boards_services.js'

// Methods
// GET /boards/
async function read_boards(req, res) {
  const boards = await boards_services.get_boards(req)
  if (boards.is_an_error) throw boards

  res.status(200).json(boards)
}

// GET /boards/1
async function read_board(req, res) {
  const board = await boards_services.get_board(req)
  if (board.is_an_error) throw board

  res.status(200).json(board)
}

// POST /boards/
async function create_board(req, res) {
  const board = await boards_services.post_board(req)
  if (board.is_an_error) throw board

  res.status(201).send(JSON.stringify(board))
}

// PUT /boards/1
async function update_board(req, res) {
  const board = await boards_services.put_board(req)
  if (board.is_an_error) throw board

  res.status(200).send(JSON.stringify(board))
}

// DELETE /boards/1
async function destroy_board(req, res) {
  const board = await boards_services.delete_board(req)
  if (board.is_an_error) throw board

  res.status(202).send(JSON.stringify(board))
}

export default {
  create_board,
  read_board,
  read_boards,
  update_board,
  destroy_board
}
