import sharp from 'sharp'

import { image_sizes } from '../config.js'
import ContentError from '../errors/content_error.js'

async function fileDuplication(file) {
  const url_destination = file.destination.replace('/originals', '')
  const [filename, extension] = file.filename.split('.')

  try {
    const promises = image_sizes.map(async ({ size, sufix }) => {
      return await sharp(file.path)
                    .resize(size).toFormat('jpeg').jpeg({ quality: 100 })
                    .toFile(`${url_destination}/profile/${filename}${sufix}.${extension}`)
    })

    return await Promise.all(promises)
    
  } catch (error) {
    throw new ContentError({ message: error.message, status: error.status })
  }
}

export default fileDuplication
