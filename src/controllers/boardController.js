import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService'


const createNew = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const newBoard = await boardService.createNew(userId, req.body)
    res.status(StatusCodes.CREATED).json(newBoard)
  } catch (error) {
    next(error)
  }
}

const getDetails = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const boardId = req.params.id
    const boardDetail = await boardService.getDetails(userId, boardId)
    res.status(StatusCodes.OK).json(boardDetail)
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {

  try {
    const boardId = req.params.id
    const data = req.body
    const result = await boardService.update(boardId, data)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const moveCarDifferenceColumn = async (req, res, next) => {

  try {
    const data = req.body
    const result = await boardService.moveCarDifferenceColumn(data)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}


const getAll = async (req, res, next) => {

  try {
    const userId = req.jwtDecoded._id
    const { page, itemsPerPage, q } = req.query
    // q là mảng các điều kiện tìm kiếm, ví dụ: { title: 'abc', description: 'xyz' }
    const filter = q
    const result = await boardService.getAll(userId, page, itemsPerPage, filter)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const boardController = {
  createNew,
  getDetails,
  update,
  moveCarDifferenceColumn,
  getAll
}