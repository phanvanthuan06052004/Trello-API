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

const updateInvitation = async ( userId, invitationId, status ) => {
  try {
    const invitation = await invitationModel.findOneById(invitationId)
    if (!invitation) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Invitation not found')
    }
    const boardId = invitation.boardInvitation.boardId
    const getBoard = await boardModel.findOneById(boardId)
    if (!getBoard) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')
    }

    // lấy all member
    const allMembersInBoard = [...getBoard.ownerIds, ...getBoard.memberIds].toString()

    // xử lý trường hợp user accept là thằng chủ board => báo lỗi
    if (status === BOARD_INVITATION_STATUS.ACCEPTED && allMembersInBoard.includes(userId)) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'You cannot accept your own invitation!')
    }

    //khởi tạo data update
    const updateData = {
      'boardInvitation.status': status
    }

    const updatedData = await invitationModel.update(invitationId, updateData)

    // TH nó accepted thì cập nhật lại board
    if (updatedData.boardInvitation.status === BOARD_INVITATION_STATUS.ACCEPTED) {
      await boardModel.pushUserToMemberIds(boardId, userId)
    }
    // console.log(updatedData)
    return updatedData
  }
  catch (error) {
    throw error
  }
}
export const invitationService = {
  createNew,
  getInvitations,
  updateInvitation
}