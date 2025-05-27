import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { BOARD_INVITATION_STATUS, INVITATION_TYPE } from '~/utils/constants'
import { EMAIL_RULE, EMAIL_RULE_MESSAGE, OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

// Define Collection (name & schema)
const INVITATION_COLLECTION_NAME = 'Invitations'
const INVITATION_COLLECTION_SCHEMA = Joi.object({
  // người mời
  inviterId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE), // unique
  // người được mời
  inviteeId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE), 
  type: Joi.string().required().valid(...Object.values(INVITATION_TYPE)),

  boardInvitation: Joi.object({
    boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE), // unique
    status: Joi.string().required().valid(...Object.values(BOARD_INVITATION_STATUS))
  }).optional(),

  createAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

// chỉ định những trường ko nên update
const INVALID_DATA_UPDATE = ['_id', 'inviterId', 'inviteeId','type', 'createAt']

const validationBeforeCreate = async (data) => {
  return await INVITATION_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createInvitation = async (data) => {
  try {
    const validation = await validationBeforeCreate(data)

    let newInvitation = {
      ...validation,
      inviterId: new ObjectId(validation.inviterId),
      inviteeId: new ObjectId(validation.inviteeId)
    }
    if (validation.boardInvitation) {
      newInvitation.boardInvitation = {
        ...validation.boardInvitation,
        boardId: new ObjectId(validation.boardInvitation.boardId)
      }
    }
    return await GET_DB().collection(INVITATION_COLLECTION_NAME).insertOne(newInvitation)
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async(id) => {
  try {
    return await GET_DB().collection(INVITATION_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (id, data) => {
  try {
    // lọc những field ko cho phép update
    Object.keys(data).forEach(key => {
      if (INVALID_DATA_UPDATE.includes(key)) {
        delete data[key]
      }
    })

    if (data.boardInvitation) {
      data.boardInvitation = {
        ...data.boardInvitation,
        boardId: new ObjectId(data.boardInvitation.boardId)
      }
    }
    const result = await GET_DB().collection(INVITATION_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: data },
      { returnDocument: 'after' } // trả về kết quả mới sau khi update
    )

    return result
  } catch (error) {
    throw new Error(error)
  }
}


export const invitationModel = {
  INVITATION_COLLECTION_NAME,
  INVITATION_COLLECTION_SCHEMA,
  createInvitation,
  findOneById,
  update
}