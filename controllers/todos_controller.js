import todos_services from '../services/todos_services.js'

// Methods
// GET /todos/
async function read_todos(req, res) {
  const { board_id } = req.params
  const todos = await todos_services.get_todos(board_id)

  res.set({ 'content-type': 'application/json; charset=utf-8' })
  res.status(200).json(todos)
}

// GET /todos/1
async function read_todo(req, res) {
  const { id } = req.params
  const board = await todos_services.get_todo(id, req.user.id)

  res.set({ 'content-type': 'application/json; charset=utf-8' })
  res.status(200).json(board)
}

// POST /todos/
async function create_todo(req, res) {
  const { board_id } = req.params
  const { content, done } = req.body

  if (!content) { return res.status(400).json({ message: 'Please provide a content!' }) }

  const todo = await todos_services.post_todo({ content, done: done || false, board_id })

  res.set({ 'content-type': 'application/json; charset=utf-8' })
  res.status(201).send(JSON.stringify(todo))
}

// PUT /todos/1
async function update_todo(req, res) {
  const { id } = req.params

  const board = await todos_services.put_todo({ id, ...req.body })

  res.set({ 'content-type': 'application/json; charset=utf-8' })
  res.status(200).json(board)
}

// DELETE /todos/1
async function destroy_todo(req, res) {
  const { id } = req.params

  if (!id) { return res.status(400).json({ message: 'Please provide a board id!' }) }

  const board = await todos_services.delete_todo(id)

  res.set({ 'content-type': 'application/json; charset=utf-8' })
  res.status(200).json(board)
}

export default {
  create_todo,
  read_todo,
  read_todos,
  update_todo,
  destroy_todo
}
