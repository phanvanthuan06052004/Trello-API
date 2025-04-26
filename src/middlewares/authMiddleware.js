import { StatusCodes } from 'http-status-codes'
import { JwtProvider } from '~/providers/JwtProvider'
import { env } from '~/config/environment'
import ApiError from '~/utils/ApiError'

// kiểm tra xác thực token gửi từ FE về có hợp lệ hay không
const isAuthorized = async (req, res, next) => {
  // Lấy token nằn trong req cookies phía client  withCredentials trong file authorizeAxios FE
  const clientAccessToken = req.cookies?.accessToken

  if (!clientAccessToken) {
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized! (Token not found)'))
    return
  }

  try {
    // Giải mã token và check hợp lệ hay không
    const accessTokenDecode = await JwtProvider.verifyToken(clientAccessToken, env.ACCESS_TOKEN_SECRET_KEY)
    // Nếu token hợp lệ => lưu vào req.jwtDecode, để sau này sử dụng cho các lớp xử lý khác
    req.jwtDecoded = accessTokenDecode
    // cho phép vượt qua kiểm tra
    next()
  } catch (error) {
    // TH token hết hạn thì gửi mã (410) về FE để xử lý refreshToken
    if (error?.message?.includes('jwt expired')) {
      next(new ApiError(StatusCodes.GONE, 'Token id expired! Please refresh Token!'))
      return
    }
    // Các TH khác thì đẩy thẳng ra lỗi (401)
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized!'))
  }
}

export const authMiddleware = {
  isAuthorized
}