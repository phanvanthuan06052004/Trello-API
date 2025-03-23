import { columnModel } from '~/models/columnModel'
import { boardModel } from '~/models/boardModel'
import { ObjectId } from 'mongodb'
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

export const columnService = {
  createNew,
  update
}