import { StatusCodes } from 'http-status-codes'
import { invitationService } from '~/services/invitationService'


const createNew = async (req, res, next) => {
  try {
    const inviterId = req.jwtDecoded._id // ID người mời, lấy từ token đã giải mã
    const result = await invitationService.createNew(req.body, inviterId)
    res.status(StatusCodes.CREATED).json(result)
  } catch (error) {
    next(error)
  }
}

export const invitationController = {
  createNew
}