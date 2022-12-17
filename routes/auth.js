import express from 'express'

// Import Controllers
import auth_controller from '../controllers/auth_controller.js'

// Router Creation
const router = express.Router()

// Routes
// /auth/signup
router.route('/signup')
  .post(auth_controller.post_signup)

// /auth/login
router.route('/login')
  .post(auth_controller.post_login)

export default router
