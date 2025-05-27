import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
import { CloudinaryProvider } from '~/providers/CloudinaryProvider'
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

const updateCard = async ( cardId, reqBody, uploadedFile ) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    let result = {}
    if (uploadedFile) {
      const cloudinaryResult = await CloudinaryProvider.streamUpload(uploadedFile.buffer, 'cards-cover')
      const newData = {
        cover: cloudinaryResult.secure_url,
        updatedAt: Date.now()
      }
      result = await cardModel.update(cardId, newData)
    } else {
      result = await cardModel.update(cardId, updateData)
    }

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