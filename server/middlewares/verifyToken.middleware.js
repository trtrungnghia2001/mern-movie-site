import ENV_CONFIG from '#server/configs/env.config'
import createHttpError from 'http-errors'
import jwt from 'jsonwebtoken'

export async function verifyToken(req, res, next) {
  try {
    const access_token = req.cookies.access_token

    if (!access_token) {
      throw createHttpError.Unauthorized('Invalid token')
    }
    jwt.verify(access_token, ENV_CONFIG.JWT.SECRET_KEY, (error, decode) => {
      if (error) {
        throw createHttpError.Unauthorized(error.message)
      }
      req.user = decode
      next()
    })
  } catch (error) {
    next(error)
  }
}
