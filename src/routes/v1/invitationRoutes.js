import express from 'express'
import { invitationController } from '~/controllers/invitationController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { invitationValidation } from '~/validations/invitationValidation'

const Router = express.Router()

Router.route('/board')
  .post(authMiddleware.isAuthorized, invitationValidation.createNew, invitationController.createNew)

Router.route('/')
  .get(authMiddleware.isAuthorized, invitationController.getInvitations)


export const InvitationRoutes = Router

