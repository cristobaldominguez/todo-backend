import express from 'express'

// Import Controllers
import todos_controller from '../controllers/todos_controller.js'
import check_param from '../middlewares/check_param_middleware.js'
import { non_existent_route } from '../helpers/non_existent_route.js'

// Router Creation
const router = express.Router({ mergeParams: true })

// Routes
// /boards/1/todos
router.route('/todos')
  .get(check_param, todos_controller.read_todos)
  .post(check_param, todos_controller.create_todo)

// Non Existent Routes
// /boards/1/todos/1
router.route('/todos/:id')
  .get(non_existent_route)
  .post(non_existent_route)
  .put(non_existent_route)
  .patch(non_existent_route)
  .delete(non_existent_route)

export default router
