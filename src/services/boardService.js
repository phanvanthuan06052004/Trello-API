import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
const createNew = async ( reqBody ) => {
  try {
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    const result = await boardModel.createNew(newBoard)


    return await boardModel.findOneById(result.insertedId)

    // return newBoard // phải nhớ return chớ ko nó bắn req liên tục
  }
  catch (error) {
    throw error
  }
}

const getDetails = async ( id ) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const result = await boardModel.getDetails(id)
    if (!result) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'board not found!')
    }
    const resBoard = cloneDeep(result) // Sao chép và tách rời cái củ
    // Format data
    resBoard.columns.forEach( column => {
      // equals này là mongoDb có hỗ trọ
      column.cards = resBoard.cards.filter(card => card.columnId.equals(column._id)) // Nếu dùng 3 = thì nhớ toString() bởi vì Id là objectId
    })

    // xóa card dư 
    delete resBoard.cards
    return resBoard
  }
  catch (error) {
    throw error
  }
}

const update = async ( id, data ) => {
  try {
    const newBoard = {
      ...data,
      updatedAt: Date.now()
    }

    return await boardModel.update(id, newBoard)
  }
  catch (error) {
    throw error
  }
}
export const boardService = {
  createNew,
  getDetails,
  update
}