import { StatusCodes } from 'http-status-codes'

const createNew = async (req, res, next) => {

  try {

    res.status(StatusCodes.CREATED).json({ massage: 'Create New board success'})
  } catch (error) {
    // console.log(error)
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ errors: error.message})
    next(error)
  }
}

export const boardController = {
  createNew
}