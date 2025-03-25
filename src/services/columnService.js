import { columnModel } from '~/models/columnModel'
import { boardModel } from '~/models/boardModel'
import { ObjectId } from 'mongodb'
import { result } from 'lodash'
import { cardModel } from '~/models/cardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
const createNew = async ( reqBody ) => {
  try {
    const newColumn = {
      ...reqBody
    }
    const result = await columnModel.createNew(newColumn)
    const getNewColumn = await columnModel.findOneById(result.insertedId)
    if (getNewColumn) {
      // thêm json chứa list card trong column đồng bộ cho FE
      getNewColumn.cards = []

      await boardModel.pushColumnIdToIds(getNewColumn)
    }
    return getNewColumn
  }
  catch (error) {
    throw error
  }
}

const update = async ( id, data ) => {
  try {
    const newColumn = {
      ...data,
      updatedAt: Date.now()
    }

    return await columnModel.update(id, newColumn)
  }
  catch (error) {
    throw error
  }
}

const deleteColumn = async ( id ) => {
  try {
    const targetColumn = await columnModel.findOneById(id)
    if (!targetColumn) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Column not found! ~ deleteColumn')
    }
    // xóa column
    await columnModel.deleteOneById(id)
    // xóa card theo columnId
    await cardModel.deleteManyCardByColumnId(id)
    // xóa columnId trong board
    await boardModel.pullColumnIdToIds(targetColumn)

    return { result: 'delete successfully!' }
  }
  catch (error) {
    throw error
  }
}

export const columnService = {
  createNew,
  update,
  deleteColumn
}