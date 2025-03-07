import { StatusCodes } from 'http-status-codes'
import express from 'express'
import { boardValidation } from '~/validations/boardValidation'
import { boardController } from '~/controllers/boardController'

const Router = express.Router()

Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ massage: 'Get seccuess'})
  })
  .post(boardValidation.createNew, boardController.createNew)

export const BoardRoutes = Router

