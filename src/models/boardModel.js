
import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { GET_DB } from '~/config/mongodb'
import { BOARD_TYPE } from '~/utils/constants'
import { columnModel } from './columnModel'
import { cardModel } from './cardModel'
import { pagingSkipValue } from '~/utils/algorithms'
import { userModel } from './userModel'

// Define Collection (name & schema)
const BOARD_COLLECTION_NAME = 'Boards'
const BOARD_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(3).max(50).trim().strict(),
  slug: Joi.string().required().min(3).trim().strict(),
  description: Joi.string().required().min(3).max(256).trim().strict(),
  // thay vì gọi lần lượt tất cả các type thì có thể viết gọn lại bằng Object.values() 
  // kết hợp với spresd operator (...) để lấy tất cả các giá trị của BOARD_TYPE
  // sau này bạn có thể mơng rộng thêm các type khác mà không cần phải sửa lại code này
  type: Joi.string().required().valid(...Object.values(BOARD_TYPE)),
  // Lưu ý các item trong mảng columnOrderIds là ObjectId nên cần thêm pattern cho chuẩn nhé, (lúc quay video số 57 mình quên nhưng sang đầu video số 58 sẽ có nhắc lại về cái này.)
  columnOrderIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),

  // ownerIds là những người tạo ra board này
  ownerIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),

  // memberIds là những người được mời vào board này
  memberIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

// chỉ định những trường ko nên update
const INVALID_DATA_UPDATE = ['_id', 'createdAt']

const validationBeforeCreate = async (data) => {
  return await BOARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (userId, data) => {
  try {
    const validation = await validationBeforeCreate(data)
    const newData = {
      ...validation,
      ownerIds: [new ObjectId(userId)]
    }
    return await GET_DB().collection(BOARD_COLLECTION_NAME).insertOne(newData)
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
const getDetails = async(userId, boardId) => {
  try {
    const queryCondition = [
      { _id: new ObjectId(boardId) }, // tìm board theo ID
      { _destroy: false }, // chỉ lấy những board chưa bị xóa
      { $or: [
        { ownerIds: { $all: [new ObjectId(userId)] } }, // ownerIds là người tạo ra board
        { memberIds: { $all: [new ObjectId(userId)] } } // memberIds là người được mời vào board
      ] }
    ]

    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).aggregate([
      { $match: { $and: queryCondition } },
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
      } },
      { $lookup: {
        from: userModel.USER_COLLECTION_NAME,
        localField: 'ownerIds',
        foreignField: '_id',
        as: 'owners',
        // pipeline trong lookup để xử lý 1 hoặc nhiều luồng
        // project để chỉ lấy những trường cần thiết
        pipeline: [{ $project: { 'password': 0, 'verifyToken': 0 } }] // không trả về password, verifyToken
      } },
      { $lookup: {
        from: userModel.USER_COLLECTION_NAME,
        localField: 'memberIds',
        foreignField: '_id',
        as: 'members',
        // pipeline trong lookup để xử lý 1 hoặc nhiều luồng
        // project để chỉ lấy những trường cần thiết
        pipeline: [{ $project: { 'password': 0, 'verifyToken': 0 } }] // không trả về password, verifyToken
      } }
    ]).toArray()

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

    return result
  } catch (error) {
    throw new Error(error)
  }
}

const pullColumnIdToIds = async (column) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(column.boardId) },
      { $pull: { columnOrderIds: new ObjectId(column._id) } }, // pull: xóa ID đó ra khỏi mảng
      { returnDocument: 'after' }
    )
    return result
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


const getAll = async (userId, page, itemsPerPage) => {
  try {
    const queryCondition = [
      { _destroy: false }, // chỉ lấy những board chưa bị xóa
      { $or: [
        { ownerIds: { $all: [new ObjectId(userId)] } }, // ownerIds là người tạo ra board
        { memberIds: { $all: [new ObjectId(userId)] } } // memberIds là người được mời vào board
      ] }
    ]

    const query = await GET_DB().collection(BOARD_COLLECTION_NAME).aggregate([
      { $match: { $and: queryCondition } }, // Điều kiện để lấy board
      { $sort: { title: 1 } }, // Sắp xếp theo title theo mã ASCii B > a

      // xử lý đa luồng
      { $facet: {
        // luồng 01: Qery board
        'queryBoard': [
          { $skip: pagingSkipValue(page, itemsPerPage) }, // Bỏ qua những board đã lấy
          { $limit: itemsPerPage } // Giới hạn số lượng board trả về
        ],
        // luồng 02: Count board
        'queryTotalBoard': [
          { $count: 'totalBoard' } // Đếm tổng số board
        ]
      }
      }
    ],
    // fix vụ B hoa và a thường sắp xếp không đúng
    { collation: { locale: 'en' } }
    ).toArray()

    const res = query[0] // Lấy luồng đầu tiên

    return {
      boards: res.queryBoard || 0,
      totalBoards: res.queryTotalBoard.length > 0 ? res.queryTotalBoard[0].totalBoard : 0
    }
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
  pullColumnIdToIds,
  update,
  getAll
}