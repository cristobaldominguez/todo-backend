// Import Services
import auth_services from '../services/auth_services.js'

// Methods
// POST /auth/signup
async function post_signup(req, res) {
  const token = await auth_services.post_signup(req, res)
  if (token.is_an_error) throw token

  res.status(200).json({ token })
}

// POST /auth/login
async function post_login(req, res) {
  const token = await auth_services.post_login(req, res)
  if (token.is_an_error) throw token

  res.status(200).json({ token })
}

export default {
  post_signup,
  post_login
}
