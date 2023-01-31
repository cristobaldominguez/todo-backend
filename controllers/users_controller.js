import { put_user } from '../db/queries/users.js'
import { generate_token } from '../services/auth_services.js'

import { sanitize_strings } from '../helpers/sanitization_helper.js'
import AuthError from '../errors/auth_error.js'

async function update_user(req, res) {
  const { id } = req.params
  const params = req.body

  if (Number(id) !== req.user.id) throw new AuthError({ message: 'You do not have permissions to perform this action' })

  // Sanitize Params
  const filtered_params = sanitize_strings({ req, params })

  // Save the params on db
  const user = await put_user(id, { ...filtered_params })

  // Check a posible error
  if (user.is_an_error) throw todo
  
  // return data
  const user_data = generate_token({ user })
  res.status(200).json(user_data)
}

export default {
  update_user
}
