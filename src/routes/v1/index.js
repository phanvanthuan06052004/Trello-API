import express from 'express'
import { BoardRoutes } from './boardRoutes'
import { ColumnRoutes } from './columnRoutes'
import { CardRoutes } from './cardRoutes'
const Router = express.Router()

// BoardsAPIs
Router.use('/boards', BoardRoutes)

// ColumnsAPIs
Router.use('/columns', ColumnRoutes)

// CardsAPIs
Router.use('/cards', CardRoutes)

export const APIs_V1 = Router

