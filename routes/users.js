import express from 'express'

// Import Controllers
import { non_existent_route } from '../helpers/non_existent_route.js'
import users_controller from '../controllers/users_controller.js'

import check_param from '../middlewares/check_param_middleware.js'

const router = express.Router()

// Routes
// /users/
router.route('/')
  .post(non_existent_route)
  .get(non_existent_route)

// /users/1
router.route('/:id')
  .get(non_existent_route)
  .put(check_param, users_controller.update_user)
  .patch(check_param, users_controller.update_user)
  .delete(non_existent_route)

export default router
