import express from 'express'
import { BoardRoutes } from './boardRoutes'
import { ColumnRoutes } from './columnRoutes'
import { CardRoutes } from './cardRoutes'
import { UserRoutes } from './userRoutes'
import { InvitationRoutes } from './invitationRoutes'
const Router = express.Router()

// BoardsAPIs
Router.use('/boards', BoardRoutes)

// ColumnsAPIs
Router.use('/columns', ColumnRoutes)

// CardsAPIs
Router.use('/cards', CardRoutes)

// UsersAPIs
Router.use('/users', UserRoutes)

// InvitationAPIs
Router.use('/invitations', InvitationRoutes)

export const APIs_V1 = Router

