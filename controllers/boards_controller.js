import boards_services from '../services/boards_services.js'

// Methods
// GET /boards/
async function read_boards(req, res) {
  const boards = await boards_services.get_boards(req.user.id)

  res.status(200).json(boards)
}

// GET /boards/1
async function read_board(req, res) {
  const { id } = req.params
  const board = await boards_services.get_board(id, req.user.id)

  res.status(200).json(board)
}

// POST /boards/
async function create_board(req, res) {
  const { name, icon, colour } = req.body

  if (!name) { return res.status(400).json({ message: 'Please provide a name!' }) }
  if (!icon) { return res.status(400).json({ message: 'Please provide an icon!' }) }
  if (!colour) { return res.status(400).json({ message: 'Please provide a colour!' }) }

  const board = await boards_services.post_board({ name, icon, colour, user_id: req.user.id })

  res.status(201).send(JSON.stringify(board))
}

// PUT /boards/1
async function update_board(req, res) {
  const { id } = req.params
  const { name, icon, colour } = req.body

  const board = await boards_services.put_board({ id, name, icon, colour, user_id: req.user.id })

  res.status(200).send(JSON.stringify(board))
}

// DELETE /boards/1
async function destroy_board(req, res) {
  const { id } = req.params

  if (!id) { return res.status(400).json({ message: 'Please provide a board id!' }) }

  const board = await boards_services.delete_board(id)

  res.status(202).send(JSON.stringify(board))
}

export default {
  create_board,
  read_board,
  read_boards,
  update_board,
  destroy_board
}
