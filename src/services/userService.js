import { StatusCodes } from 'http-status-codes'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import bcryptjs from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { pickUser } from '~/utils/formatters'
import { WEBSITE_DOMAIN } from '~/utils/constants'
import { BrevoProvider } from '~/providers/BrevoProvider'
import { JwtProvider } from '~/providers/JwtProvider'
import { env } from '~/config/environment'
import { CloudinaryProvider } from '~/providers/CloudinaryProvider'
const createNew = async ( reqBody ) => {
  try {
    // check email có tồn tại hay không
    const checkEmail = await userModel.findOneByEmail(reqBody.email)
    if (checkEmail) {
      throw new ApiError(StatusCodes.CONFLICT, 'Email already exited!')
    }
    // khởi tạo data
    const nameFromEmail = reqBody.email.split('@')[0]
    const newUser = {
      email: reqBody.email,
      password: bcryptjs.hashSync(reqBody.password, 8),
      username: nameFromEmail,
      displayname: nameFromEmail,
      verifyToken: uuidv4()
    }
    // lưu data
    const result = await userModel.createNew(newUser)
    const getNewUser = await userModel.findOneById(result.insertedId)
    // verify  email
    const verificationLink = `${WEBSITE_DOMAIN}/account/verification?email=${getNewUser.email}&token=${getNewUser.verifyToken}`
    const customSubject = 'VERIFY EMAIL TO LOGIN: please verify email before login using our services!'
    const htmlContent = `
      <h3>Here is your verification link: </h3>
      <h3>${verificationLink}</h3>
      <h3>Sincerely,<br/> - thuanPhan</h3>
    `
    // gọi email service để gửi email
    await BrevoProvider.sendEmail(getNewUser.email, customSubject, htmlContent)
    // retrun data
    return pickUser(getNewUser)
  }
  catch (error) {
    throw error
  }
}

const verify = async ( reqBody ) => {
  try {
    const checkEmail = await userModel.findOneByEmail(reqBody.email)
    if (!checkEmail) throw new ApiError(StatusCodes.NOT_FOUND, 'Email not found!')
    if (checkEmail.isActive) throw new ApiError(StatusCodes.CONFLICT, 'Email already verified!')
    if (checkEmail.verifyToken !== reqBody.token) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Token is not correct!')

    const newData = {
      isActive: true,
      verifyToken: null
    }
    const result = await userModel.update(checkEmail._id, newData)
    return pickUser(result)
  } catch (error) {
    throw error
  }
}

const login = async ( reqBody ) => {
  try {
    const checkEmail = await userModel.findOneByEmail(reqBody.email)
    if (!checkEmail) throw new ApiError(StatusCodes.NOT_FOUND, 'Email not found!')
    if (!checkEmail.isActive) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Email is not verified!')
    if (!bcryptjs.compareSync(reqBody.password, checkEmail.password)) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Password or email is not correct!')
    // tạo access token và refresh token
    const userInfo = { _id: checkEmail._id, email: checkEmail.email }

    // Tạo access token và refresh token
    const accessToken = JwtProvider.generateToken(userInfo, env.ACCESS_TOKEN_SECRET_KEY, env.ACCESS_TOKEN_LIFETIME)
    const refreshToken = JwtProvider.generateToken(userInfo, env.REFRESH_TOKEN_SECRET_KEY, env.REFRESH_TOKEN_LIFETIME)

    // trả về thông tin user và token
    return { accessToken, refreshToken, ...pickUser(checkEmail) }
  }
  catch (error) {
    throw error
  }
}

const refreshToken = async (token) => {
  try {
    // Giải mã token check hợp lệ hay không
    const refreshTokenDecoded = await JwtProvider.verifyToken(token, env.REFRESH_TOKEN_SECRET_KEY)

    const userInfo = {
      _id: refreshTokenDecoded._id,
      email: refreshTokenDecoded.email
    }

    const accessToken = JwtProvider.generateToken(userInfo, env.ACCESS_TOKEN_SECRET_KEY, env.ACCESS_TOKEN_LIFETIME)
    return { accessToken }
  } catch (error) {
    throw error
  }
}

const update = async ( userId, reqBody, fileAvatar ) => {
  try {
    const exitedUser = await userModel.findOneById(userId)
    if (!exitedUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found to update!')
    if(!exitedUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is not verified!')

    let updatedUser = {}

    // trường hợp đổi mật khẩu
    if (reqBody.current_password && reqBody.new_password) {
      if (!bcryptjs.compareSync(reqBody.current_password, exitedUser.password)) {
        throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Current password is not correct!')
      }
      updatedUser = await userModel.update(userId, {
        password: bcryptjs.hashSync(reqBody.new_password, 8)
      })
      return pickUser(updatedUser)
    } else if (fileAvatar) {
      // trường hợp update avatar
      const cloudinaryResult = await CloudinaryProvider.streamUpload(fileAvatar.buffer, 'avatars')
      const newData = {
        avatar: cloudinaryResult.secure_url
      }
      updatedUser = await userModel.update(userId, newData)
    } else {
      updatedUser = await userModel.update(userId, {
        displayname: reqBody.displayName
      })
    }

    return pickUser(updatedUser)
  }
  catch (error) {
    throw error
  }
}

export const userService = {
  createNew,
  verify,
  login,
  refreshToken,
  update
}