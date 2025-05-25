import { StatusCodes } from 'http-status-codes'
import multer from 'multer'
import ApiError from '~/utils/ApiError'
import { ALLOW_COMMON_FILE_TYPES, LIMIT_COMMON_FILE_SIZE } from '~/utils/validators'

const customFileFilter = (req, file, cb) => {
  // đối với multer thì file sẽ có các thuộc tính như: file.mimetype, file.size, file.originalname
  if (!ALLOW_COMMON_FILE_TYPES.includes(file.mimetype)) {
    const error = 'File type is invalid. Only accept jpg, jpeg and png'
    return cb(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error), null)
  }

  return cb(null, true) // nếu không có lỗi thì cb(null, true) để tiếp tục upload
}

const upload = multer({
  limits: { fileSize: LIMIT_COMMON_FILE_SIZE },
  fileFilter: customFileFilter
})

export const multerUploadMiddleware = { upload }