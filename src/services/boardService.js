import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/boardModel'
const createNew = async ( reqBody ) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    const result = await boardModel.createNew(newBoard)


    return await boardModel.findOneById(result.insertedId)

    // return newBoard // phải nhớ return chớ ko nó bắn req liên tục
  }
  catch (error) {
    throw error
  }
}
export const boardService = {
  createNew
}