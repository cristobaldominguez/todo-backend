import express from 'express'

// Import Controllers
import board_controller from '../controllers/boards_controller.js'

// Import Nested Routes
import nested_todos_routes from './nested_todos.js'

// Router Creation
const router = express.Router()

// Routes
// /boards/
router.route('/')
  .post(board_controller.create_board)
  .get(board_controller.read_boards)

// /boards/1
router.route('/:id')
  .get(board_controller.read_board)
  .put(board_controller.update_board)
  .patch(board_controller.update_board)
  .delete(board_controller.destroy_board)

router.use('/:board_id/todos', nested_todos_routes)

export default router
