
import Joi from 'joi'
import { ObjectId, ReturnDocument } from 'mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { GET_DB } from '~/config/mongodb'
import { BOARD_TYPE } from '~/utils/constants'
import { columnModel } from './columnModel'
import { cardModel } from './cardModel'

// Define Collection (name & schema)
const BOARD_COLLECTION_NAME = 'Boards'
const BOARD_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(3).max(50).trim().strict(),
  slug: Joi.string().required().min(3).trim().strict(),
  description: Joi.string().required().min(3).max(256).trim().strict(),
  type: Joi.string().valid(BOARD_TYPE.PUBLIC, BOARD_TYPE.PRIVATE).required(),
  // Lưu ý các item trong mảng columnOrderIds là ObjectId nên cần thêm pattern cho chuẩn nhé, (lúc quay video số 57 mình quên nhưng sang đầu video số 58 sẽ có nhắc lại về cái này.)
  columnOrderIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

// chỉ định những trường ko nên update
const INVALID_DATA_UPDATE = ['_id', 'createdAt']

const validationBeforeCreae = async (data) => {
  return await BOARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validation = await validationBeforeCreae(data)
    return await GET_DB().collection(BOARD_COLLECTION_NAME).insertOne(validation)
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async(id) => {
  try {
    return await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
  } catch (error) {
    throw new Error(error)
  }
}

// Aggregate: câu queery tổng hợp join các bản lại với nhau
const getDetails = async(id) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).aggregate([
      { $match: { // Điều kiện đúng để thực hiện
        _id: new ObjectId(id),
        _destroy: false
      } },
      { $lookup: {
        from: columnModel.COLUMN_COLLECTION_NAME,
        localField: '_id',
        foreignField: 'boardId',
        as: 'columns'
      } },
      { $lookup: {
        from: cardModel.CARD_COLLECTION_NAME,
        localField: '_id',
        foreignField: 'boardId',
        as: 'cards'
      }
      }]).toArray()

    return result[0] || null
  } catch (error) {
    throw new Error(error)
  }
}

const pushColumnIdToIds = async (column) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(column.boardId) },
      { $push: { columnOrderIds: new ObjectId(column._id) } },
      { returnDocument: 'after' }
    )

    return result.value
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (id, data) => {
  try {
    Object.keys(data).forEach(key => {
      if (INVALID_DATA_UPDATE.includes(key)) {
        delete data[key]
      }
    })

    // kiểm tra object ID
    if (data.columnOrderIds) {
      data.columnOrderIds = data.columnOrderIds.map(_id => (new ObjectId(_id)))
    }

    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: data },
      { returnDocument: 'after' }
    )

    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const boardModel = {
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  getDetails,
  pushColumnIdToIds,
  update
}