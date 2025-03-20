import { columnModel } from '~/models/columnModel'
import { boardModel } from '~/models/boardModel'
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

      boardModel.pushColumnIdToIds(getNewColumn)
    }
    return getNewColumn
  }
  catch (error) {
    throw error
  }
}


export const columnService = {
  createNew
}