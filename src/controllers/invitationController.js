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

const getInvitations = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const result = await invitationService.getInvitations(userId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const updateInvitation = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const status = req.body.status
    const invitationId = req.params.invitationId
    const result = await invitationService.updateInvitation(userId, invitationId, status)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const invitationController = {
  createNew,
  getInvitations,
  updateInvitation
}