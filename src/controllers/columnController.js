import { StatusCodes } from 'http-status-codes'
import { columnService } from '~/services/columnService'


const createNew = async (req, res, next) => {

  try {
    const newColumn = await columnService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(newColumn)
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {

  try {
    const columnId = req.params.id
    const data = req.body
    const result = await columnService.update(columnId, data)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const columnController = {
  createNew,
  update
}