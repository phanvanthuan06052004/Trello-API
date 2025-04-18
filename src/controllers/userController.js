import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/userService'

const createNew = async (req, res, next) => {
  try {
    const newUser = await userService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(newUser)
  } catch (error) {
    next(error)
  }
}

const verify = async (req, res, next) => {
  try {
    const result = await userService.verify(req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const result = await userService.login(req.body)

    // xử lý httpOnly cookie ở đây
    
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}


export const userController = {
  createNew,
  verify,
  login
}