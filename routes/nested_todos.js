import express from 'express'

// Import Controllers
import todos_controller from '../controllers/todos_controller.js'

// Router Creation
const router = express.Router({ mergeParams: true })

// Routes
// /boards/1/todos
router.route('/')
  .post(todos_controller.create_todo)
  .get(todos_controller.read_todos)

export default router
