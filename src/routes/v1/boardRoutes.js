import { StatusCodes } from 'http-status-codes'
import express from 'express'

const Router = express.Router()

Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ massage: 'Get seccuess'})
  })
  .post((req, res) => {

  })

export const BoardRoutes = Router

