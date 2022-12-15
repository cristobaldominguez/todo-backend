function setContentType(req, res, next) {
  res.set({ 'content-type': 'application/json; charset=utf-8' })

  next()
}

export default setContentType
