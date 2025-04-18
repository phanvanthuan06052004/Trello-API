import { JWT }  from 'jsonwebtoken'
// jwt thường có 3 phần: header, payload, signature
const generateToken = (userInfo, secretSignature, tokenLife) => {
  try {
    return JWT.sign(userInfo, secretSignature, { algorithm: 'HS256', expiresIn: tokenLife }) // thường thì mặc định là HS256
  } catch (error) {
    throw error
  }
}

// verify token: kiểm tra token có hợp lệ hay không
const verifyToken = (token, secretSignature) => {
  try {
    return JWT.verify(token, secretSignature)
  } catch (error) {
    throw error
  }
}

export const JwtProvider = {
  generateToken,
  verifyToken
}