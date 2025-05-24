import express from 'express'
import { userController } from '~/controllers/userController'
import { userValidation } from '~/validations/userValidation'
import { authMiddleware } from '~/middlewares/authMiddleware'
const Router = express.Router()

Router.route('/register')
  .post(userValidation.createNew, userController.createNew)

Router.route('/verify')
  .post(userValidation.verify, userController.verify)

Router.route('/login')
  .post(userValidation.login, userController.login)


Router.route('/login')
  .post(userValidation.login, userController.login)

Router.route('/logout')
  .post(userController.logout)


Router.route('/refresh-token')
  .post(userController.refreshToken)

Router.route('/update')
  .put(authMiddleware.isAuthorized, userValidation.update, userController.update)

export const UserRoutes = Router

