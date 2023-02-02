import path from 'path'
import multer from 'multer'
import { v4 as uuid } from 'uuid'

import { root } from '../config.js'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(root, '/uploads/originals'))
  },
  filename: function (req, file, cb) {
    cb(null, uuid() + `${path.extname(file.originalname)}`)
  }
})

const upload = multer({
  limits: {
    fileSize: 4 * 1024 * 1024
  },
  storage
})

export default upload
