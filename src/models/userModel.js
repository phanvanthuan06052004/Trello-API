import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { EMAIL_RULE, EMAIL_RULE_MESSAGE } from '~/utils/validators'

const USER_ROLE = {
  CLIENT: 'client',
  ADMIN: 'admin'
}
// Define Collection (name & schema)
const USER_COLLECTION_NAME = 'User'
const USER_COLLECTION_SCHEMA = Joi.object({
  email: Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE), // unique
  password: Joi.string().required(),
  // username cắt ra từ email sẽ có khả năng là không unique do tên các nhà cung cấp khác nhau
  username: Joi.string().required().trim().strict(),
  displayname: Joi.string().required().trim().strict(),
  avatar: Joi.string().default(null),
  role: Joi.string().valid(USER_ROLE.CLIENT, USER_ROLE.ADMIN).default(USER_ROLE.CLIENT),

  isActive: Joi.boolean().default(false),
  verifyToken: Joi.string(),

  createAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

// chỉ định những trường ko nên update
const INVALID_DATA_UPDATE = ['_id', 'email', 'username', 'createAt']

const validationBeforeCreate = async (data) => {
  return await USER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validation = await validationBeforeCreate(data)
    return await GET_DB().collection(USER_COLLECTION_NAME).insertOne(validation)
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async(id) => {
  try {
    return await GET_DB().collection(USER_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
  } catch (error) {
    throw new Error(error)
  }
}

const findOneByEmail = async(emailValue) => {
  try {
    return await GET_DB().collection(USER_COLLECTION_NAME).findOne({
      email: emailValue
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

    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: data },
      { returnDocument: 'after' } // trả về kết quả mới sau khi update
    )

    return result
  } catch (error) {
    throw new Error(error)
  }
}

const deleteOneById = async ( id ) => {
  try {

    const result = await GET_DB().collection(USER_COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) })

    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const userModel = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  findOneByEmail,
  update,
  deleteOneById
}