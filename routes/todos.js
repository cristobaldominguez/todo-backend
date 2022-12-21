import express from 'express'

// Import Controllers
import todos_controller from '../controllers/todos_controller.js'
import check_param from '../middlewares/check_param_middleware.js'

// Router Creation
const router = express.Router({ mergeParams: true })

// Routes
// /todos/1
router.route('/:id')
  .get(check_param, todos_controller.read_todo)
  .put(check_param, todos_controller.update_todo)
  .delete(check_param, todos_controller.destroy_todo)

export default router
