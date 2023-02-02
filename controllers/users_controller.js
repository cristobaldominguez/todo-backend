import { put_user, put_user_photo, get_user_by } from '../db/queries/users.js'
import { generate_token } from '../services/auth_services.js'
import { sanitize_strings } from '../helpers/sanitization_helper.js'
import AuthError from '../errors/auth_error.js'
import fileDuplication from '../services/file_duplication.js'

async function update_user(req, res) {
  const { id } = req.params
  const params = req.body

  if (params?.dark_mode === req.user?.dark_mode) return res.status(200).json({ ok: true })
  if (Number(id) !== req.user.id) throw new AuthError({ message: 'You do not have permissions to perform this action' })

  // Handle Image Uploading
  if (req.file) {
    const dup = fileDuplication(req.file)
    if (dup.is_an_error) throw dup

    // Save image into db
    const [file_name, file_ext] = req.file.filename.split('.')
    await put_user_photo({ user_id: req.user.id, file_name, file_ext })
  }

  // Sanitize Params
  const filtered_params = sanitize_strings({ req, params })
  const any_param = !!Object.entries(filtered_params).length

  // Save the params on db
  const user = any_param ? 
                  await put_user(id, { ...filtered_params }) :
                  await get_user_by({ id: req.user.id })
  
  // Check a posible error
  if (user.is_an_error) throw todo

  // return data
  const user_data = generate_token({ user })
  res.status(200).json(user_data)
}

export default {
  update_user
}
