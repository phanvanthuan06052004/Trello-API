import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService'
const createNew = async (req, res, next) => {

  try {
    const newBoard = await boardService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(newBoard)
  } catch (error) {
    // console.log(error)
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ errors: error.message})
    next(error)
  }
}

const getDetails = async (req, res, next) => {

  try {
    const boardId = req.params.id
    const boardDetail = await boardService.getDetails(boardId)
    res.status(StatusCodes.OK).json(boardDetail)
  } catch (error) {
    next(error)
  }
}

export const boardController = {
  createNew,
  getDetails
}