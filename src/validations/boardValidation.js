import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiError from '~/utils/ApiError'
import { BOARD_TYPE } from '~/utils/constants'

const createNew = async (req, res, next) => {
  const correctcondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict().messages({
      'string.base': 'Title must be a string',
      'string.empty': 'Title cannot be empty',
      'string.min': 'Title must have at least {#limit} characters',
      'string.max': 'Title cannot exceed {#limit} characters',
      'string.trim': 'Title cannot have whitespace at the beginning or end',
      'any.required': 'Title is a required field'
    }),
    description: Joi.string().required().min(3).max(256).trim().strict().messages({
      'string.base': 'Description must be a string',
      'string.empty': 'Description cannot be empty',
      'string.min': 'Description must have at least {#limit} characters',
      'string.max': 'Description cannot exceed {#limit} characters',
      'string.trim': 'Description cannot have whitespace at the beginning or end',
      'any.required': 'Description is a required field'
    }),
    type: Joi.string().valid(BOARD_TYPE.PUBLIC, BOARD_TYPE.PRIVATE).required()
  })


  try {
    // console.log(req.body)
    // abortEarly: false là để liệt kê ra tất cả các lỗi khi có error
    await correctcondition.validateAsync(req.body, { abortEarly: false })
    next() // chuyển tiếp đến bước xử lí tiếp theo
  } catch (error) {
    // console.log(error)
    // res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ error: new Error(error).message})
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message ))
  }
}

const update = async (req, res, next) => {
  const correctCondition = Joi.object({
    // trong phần Update ko nên có required bởi vì có thể data gửi lên ko cần thiết kiểm tra
    title: Joi.string().min(3).max(50).trim().strict(),
    description: Joi.string().min(3).max(256).trim().strict(),
    type: Joi.string().valid(BOARD_TYPE.PUBLIC, BOARD_TYPE.PRIVATE)
  })
  try {
    // abortEarly: false là để liệt kê ra tất cả các lỗi khi có error
    // allowUnknown: true cho phép ko cần validate các trường ko cần thiết
    await correctCondition.validateAsync(req.body, {
      abortEarly: false,
      allowUnknown: true
    })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message ))
  }
}

export const boardValidation = {
  createNew,
  update
}