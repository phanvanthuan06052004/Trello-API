import { StatusCodes } from 'http-status-codes'
import express from 'express'
import { BoardRoutes } from './boardRoutes'
const Router = express.Router()

// BoardsAPIs
Router.use('/boards', BoardRoutes)

export const APIs_V1 = Router

