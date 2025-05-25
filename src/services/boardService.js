import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep, result } from 'lodash'
import { columnModel } from '~/models/columnModel'
import { cardModel } from '~/models/cardModel'
import { ObjectId } from 'mongodb'
import { DEFAULT_PAGE, DEFAULT_ITEMS_PER_PAGE } from '~/utils/constants'
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

const moveCarDifferenceColumn = async ( data ) => {
  try {

    // update cardOrderedIds của column củ
    await columnModel.update(data.prevColumnId, {
      cardOrderIds: data.prevCardOrderedIds,
      updatedAt: Date.now()
    })
    // update cardOrderedIds của column mới
    await columnModel.update(data.nextColumnId, {
      cardOrderIds: data.nextCardOrderedIds,
      updatedAt: Date.now()
    })
    // update lại columnId của card vừa mới kéo
    await cardModel.update(data.dragCardId, {
      columnId: data.nextColumnId
    })

    return { result: 'successfully!' }
  }
  catch (error) {
    throw error
  }
}

const getAll = async ( userId, page, itemsPerPage ) => {
  try {
    if (!page) page = DEFAULT_PAGE || 1
    if (!itemsPerPage) itemsPerPage = DEFAULT_ITEMS_PER_PAGE || 12
    
    const result = await boardModel.getAll(userId, parseInt(page, 10), itemsPerPage)
    return result
  }
  catch (error) {
    throw error
  }
}

export const boardService = {
  createNew,
  getDetails,
  update,
  moveCarDifferenceColumn,
  getAll
}