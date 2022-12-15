import express from 'express'

// Import Controllers
import todos_controller from '../controllers/todos_controller.js'

// Router Creation
const router = express.Router({ mergeParams: true })

// Routes
// /boards/1/todos/1
router.route('/:id')
  .get(todos_controller.read_todo)
  .put(todos_controller.update_todo)
  .delete(todos_controller.destroy_todo)

export default router
