import express from 'express'

// Import Controllers
import board_controller from '../controllers/boards_controller.js'
import check_param from '../middlewares/check_param_middleware.js'

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
  .get(check_param, board_controller.read_board)
  .put(check_param, board_controller.update_board)
  .patch(check_param, board_controller.update_board)
  .delete(check_param, board_controller.destroy_board)

router.use('/:board_id', nested_todos_routes)

export default router
