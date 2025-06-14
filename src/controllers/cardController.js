import { StatusCodes } from 'http-status-codes'
import { cardService } from '~/services/cardService'


const createNew = async (req, res, next) => {

  try {
    const newCard = await cardService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(newCard)
  } catch (error) {
    next(error)
  }
}

const updateCard = async (req, res, next) => {
  try {
    const cardId = req.params.id
    const uploadedFile = req.file
    const userInfor = req.jwtDecoded
    const newCard = await cardService.updateCard(cardId, req.body, uploadedFile, userInfor)
    res.status(StatusCodes.CREATED).json(newCard)
  } catch (error) {
    next(error)
  }
}


export const cardController = {
  createNew,
  updateCard
}