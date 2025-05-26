import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
const createNew = async ( reqBody ) => {
  try {
    const newCard = {
      ...reqBody
    }
    const result = await cardModel.createNew(newCard)
    const getNewCard = await cardModel.findOneById(result.insertedId.toString())
    if (getNewCard) {
      await columnModel.pushCardIdToIds(getNewCard)
    }
    return getNewCard
  }
  catch (error) {
    throw error
  }
}

const updateCard = async ( cardId, reqBody ) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const result = await cardModel.update(cardId, updateData)

    return result
  }
  catch (error) {
    throw error
  }
}


export const cardService = {
  createNew,
  updateCard
}