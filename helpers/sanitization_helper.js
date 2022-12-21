function sanitize_post_board(req, params) {
  const new_obj = {}
  for (const key in params) {
    if (Object.hasOwnProperty.call(params, key)) {
      new_obj[key] = req.sanitize(params[key]).trim()
    }
  }

  return new_obj
}

export {
  sanitize_post_board
}