// Import Queries
import { count_todos } from '../db/queries/todos.js'

// ErrorHandling
import ContentError from '../errors/content_error.js'

// Helpers
import isEmpty from '../helpers/is_empty.js'
import { sanitize_strings, remove_html_from_string } from '../helpers/sanitization_helper.js'

async function sanitizeTodosService(req) {
  if (isEmpty(req.body)) throw new ContentError({ message: "The request's body is empty", status: 400 })

  // Sanitize String Params
  const { content: raw_content, done, sort: sort_number } = sanitize_strings({req, params: req.body})

  // Sanitize Content and Provide an Error if It's not Included
  const content = raw_content !== undefined ? remove_html_from_string(raw_content) : undefined
  if (req.method === 'POST' && !content) { throw new ContentError({ message: 'Please provide a content!' }) }

  // Set Sort Number
  const sort = (sort_number === undefined && req.method === 'POST') ? ( parseInt(await count_todos(req.params.board_id)) + 1 ) : sort_number

  return { content, done, sort }
}

export default sanitizeTodosService
