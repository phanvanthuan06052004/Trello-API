import { StatusCodes } from 'http-status-codes'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { pickUser } from '~/utils/formatters'
import { BOARD_INVITATION_STATUS, INVITATION_TYPE } from '~/utils/constants'
import { boardModel } from '~/models/boardModel'
import { invitationModel } from '~/models/invitationModel'
import { get } from 'lodash'

const createNew = async ( reqBody, inviterId ) => {
  try {
    // find inviter
    const inviter = await userModel.findOneById(inviterId)
    // find invetee
    const invitee = await userModel.findOneByEmail(reqBody.inviteeEmail)
    // find board
    const board = await boardModel.findOneById(reqBody.boardId)

    if ( !inviter || !invitee || !board ) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Inviter, invitee or board not found')
    }

    // khởi tạo dữ liệu mới
    const newInvitation = {
      inviterId,
      inviteeId: invitee._id.toString(),
      type: INVITATION_TYPE.BOARD_INVITATION,
      boardInvitation: {
        boardId: board._id.toString(),
        status: BOARD_INVITATION_STATUS.PENDING
      }
    }

    const result = await invitationModel.createInvitation(newInvitation)
    const getInvitation = await invitationModel.findOneById(result.insertedId)

    return {
      ...getInvitation,
      board,
      inviter: pickUser(inviter),
      invitee: pickUser(invitee)
    }
  }
  catch (error) {
    throw error
  }
}

const getInvitations = async ( userId ) => {
  try {
    const invitations = await invitationModel.findInvitationsByUserId(userId)

    const response = invitations.map(invitation => ({
      ...invitation,
      inviter: invitation.inviter[0],
      invitee: invitation.invitee[0],
      board: invitation.board[0]
    }))
    return response
  }
  catch (error) {
    throw error
  }
}

export const invitationService = {
  createNew,
  getInvitations
}