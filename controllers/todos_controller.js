import todos_services from '../services/todos_services.js'

// Methods
// GET /todos/
async function read_todos(req, res) {
  const todos = await todos_services.get_todos(req)
  if (todos.is_an_error) throw todos

  res.status(200).json(todos)
}

// GET /todos/1
async function read_todo(req, res) {
  const todo = await todos_services.get_todo(req)
  if (todo.is_an_error) throw todo

  res.status(200).json(todo)
}

// POST /todos/
async function create_todo(req, res) {
  const todo = await todos_services.post_todo(req)
  if (todo.is_an_error) throw todo

  res.status(201).send(JSON.stringify(todo))
}

// PUT /todos/1
async function update_todo(req, res) {
  const todo = await todos_services.put_todo(req)
  if (todo.is_an_error) throw todo

  res.status(200).json(todo)
}

// DELETE /todos/1
async function destroy_todo(req, res) {
  const todo = await todos_services.delete_todo(req)
  if (todo.is_an_error) throw todo

  res.status(200).json(todo)
}

export default {
  create_todo,
  read_todo,
  read_todos,
  update_todo,
  destroy_todo
}
