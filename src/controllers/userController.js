import { StatusCodes } from 'http-status-codes'
import ms from 'ms'
import { userService } from '~/services/userService'
import ApiError from '~/utils/ApiError'

const createNew = async (req, res, next) => {
  try {
    const newUser = await userService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(newUser)
  } catch (error) {
    next(error)
  }
}

const verify = async (req, res, next) => {
  try {
    const result = await userService.verify(req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const result = await userService.login(req.body)

    // xử lý httpOnly cookie cho phía trình duyệt
    // thời gian sống của Cookie khác với thời gian sống của token
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const logout = async (req, res, next) => {
  try {
    // xóa cookie trên trình duyệt
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')

    res.status(StatusCodes.OK).json({ loggedOut: true })
  } catch (error) {
    next(error)
  }
}

const refreshToken = async (req, res, next) => {
  try {
    const result = await userService.refreshToken(req.cookies?.refreshToken)

    res.cookie('accessToken', result.accessToken, {
      httpOnly: true, // Chỉ cho phép truy cập cookie thông qua HTTP/HTTPS, không cho JavaScript truy cập
      secure: true, // Cookie chỉ được gửi qua kết nối HTTPS
      sameSite: 'none', // Cho phép cookie hoạt động trong môi trường cross-site
      maxAge: ms('14 days') // Thời gian sống của cookie là 14 ngày (tính bằng milliseconds)
    })

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(new ApiError(StatusCodes.FORBIDDEN, 'Please sign in! (from refresh token)'))
  }
}

const update = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const result = await userService.update(userId, req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const userController = {
  createNew,
  verify,
  login,
  logout,
  refreshToken,
  update
}