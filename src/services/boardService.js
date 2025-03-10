import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
const createNew = async ( reqBody ) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    const result = await boardModel.createNew(newBoard)


    return await boardModel.findOneById(result.insertedId.toString())

    // return newBoard // phải nhớ return chớ ko nó bắn req liên tục
  }
  catch (error) {
    throw error
  }
}

const getDetails = async ( id ) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const result = await boardModel.getDetails(id)
    if (!result) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'board not found!')
    }
    return result
  }
  catch (error) {
    throw error
  }
}
export const boardService = {
  createNew,
  getDetails
}