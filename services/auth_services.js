import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

// Import Queries
import { create_user, get_user_by } from '../db/queries/users.js'

// ErrorHandling
import AuthError from '../errors/auth_error.js'
import ValidationError from '../errors/validation_error.js'

// Import Config
import { email_regex } from '../config.js'

// Import helpers
import { sanitize_strings } from '../helpers/sanitization_helper.js'

// DotEnv
const accessTokenSecret = process.env.SECRET_KEY

// POST /auth/signup
async function post_signup(req) {
  if (!req.body.email) throw new ValidationError({ message: 'Email must to be present.', field: 'email' })
  if (!req.body.first_name) throw new ValidationError({ message: 'First name must to be present.', field: 'first_name' })
  if (!req.body.last_name) throw new ValidationError({ message: 'Last name must to be present.', field: 'last_name' })
  if (!req.body.password) throw new ValidationError({ message: 'Password must to be present.', field: 'password' })
  if (!req.body.password_confirm) throw new ValidationError({ message: 'Password Confirm must to be present.', field: 'password_confirm' })

  const email = req.sanitize(req.body.email).toLowerCase()
  const { first_name, last_name } = sanitize_strings({req, params: req.body})
  const { password, password_confirm } = req.body

  if (!email.match(email_regex)) { throw new AuthError({ message: 'Email field have not a valid value.' }) }

  if (!(email && password)) throw new AuthError({ message: 'Data not formatted properly. Please provide email and password.' })
  if (password !== password_confirm) throw new AuthError({ message: 'Password and password confirm fields doesn\'t match.' })
  if (!(first_name || last_name)) throw new AuthError({ message: 'Please provide a full name.' })

  // creating a new user
  const user = { email, password, first_name, last_name }

  // generate salt to hash password
  const salt = await bcrypt.genSalt(10)

  // set user password to hashed password
  user.password = await bcrypt.hash(user.password, salt)

  try {
    const saved_user = await create_user(user)
    return generate_token({ user: await saved_user })

  } catch (err) {
    if (err.is_an_error) { 
      return err
    }

    return new Error()
  }
}

// POST /auth/login
async function post_login(req) {
  if (!req.body.email) throw new ValidationError({ message: 'Email must to be present.' })
  if (!req.body.password) throw new ValidationError({ message: 'Password must to be present.' })

  const email = req.sanitize(req.body.email).toLowerCase()
  const { password } = req.body

  if (!email.match(email_regex)) { throw new AuthError({ message: 'Email field have not a valid value.' }) }

  const user = await get_user_by({ email })
  if (user) {
    // check user password with hashed password stored in the database
    const validPassword = await bcrypt.compare(password, user.password)

    if (validPassword) {
      return generate_token({ user })

    } else {
      // Password incorrect
      throw new AuthError({ message: 'Invalid email or password.', status: 400 })
    }

  } else {
    // Email does not exist
    throw new AuthError({ message: 'Invalid email or password.', status: 401 })
  }
}

// Middlewares
function authenticate(req, res, next) {
  const jwt_auth = req.headers.authorization

  // Get token
  const token = jwt_auth ? get_token_from_jwt(jwt_auth) : null
  if (!token) throw new AuthError({ message: 'The token has not been provided.', status: 401 })

  // Verify token
  jwt.verify(token, accessTokenSecret, (err, _) => {
    if (err) throw new AuthError({ message: 'The token is not valid.', status: 401 })

    req.token = token
    next()
  })
}

function set_user(req, _, next) {
  if (!req.token) return req.user = null

  // Verify validity of token
  jwt.verify(req.token, accessTokenSecret, (err, user) => {
    if (err) return req.user = null

    // Sets user
    req.user = {...user, name: `${user.first_name} ${user.last_name}`}
    next()
  })
}

function get_token_from_jwt(bearer) {
  return bearer.split(' ')[1]
}

function generate_token({ user }) {
  const token = jwt.sign(user, accessTokenSecret)
  return {
    user: {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      full_name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      dark_mode: user.dark_mode,
      photo: {
        filename: user.filename || null,
        extension: user.extension || null
      }
    },
    accessToken: token
  }
}

export {
  set_user,
  authenticate,
  generate_token
}

export default { post_signup, post_login }
