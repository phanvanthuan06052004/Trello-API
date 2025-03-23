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

Router.route('/:id')
  .get(boardController.getDetails)
  .put(boardValidation.update, boardController.update)

Router.route('/support/moveCardDifferenceColumn')
  .put(boardValidation.moveCarDifferenceColumn, boardController.moveCarDifferenceColumn)

export const BoardRoutes = Router

