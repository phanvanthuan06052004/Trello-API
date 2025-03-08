import { slugify } from '~/utils/formatters'

const createNew = ( reqBody ) => {
  const newBoard = {
    ...reqBody,
    slug: slugify(reqBody.title)
  }

  return newBoard // phải nhớ return chớ ko nó bắn req liên tục
}

export const boardService = {
  createNew
}