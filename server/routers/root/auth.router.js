import express from 'express'
import createHttpError from 'http-errors'
import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'
import { handleResponse } from '#server/helpers/responses.helper'
import { verifyToken } from '#server/middlewares/verifyToken.middleware'
import userModel from '#server/models/user.model'
import { auth_utils } from '#server/utils/auth.util'
import ENV_CONFIG from '#server/configs/env.config'
import { USER } from '#server/helpers/constants.helper'
import upload from '#server/configs/multer.config'
import storage_service from '#server/services/storage.service'
import mail_service from '#server/services/mail.service'
import tokkenModel from '#server/models/token.model'

const authRouter = express.Router()

authRouter.post('/signup', async (req, res, next) => {
  try {
    const body = req.body
    // validate
    const validate = auth_utils.schemaSignup.validate(body)
    if (validate.error) {
      throw createHttpError.BadRequest(validate.error.message)
    }

    // check exists user
    const userExists = await userModel.findOne({
      email: body.email,
    })
    if (userExists) {
      throw createHttpError.Conflict('User already exists')
    }

    // hash password
    const hashedPassword = await auth_utils.hashPassword(body.password)

    // create a new user
    await userModel
      .create({
        ...body,
        password: hashedPassword,
      })
      .then((value) => {
        // send email to new user
        mail_service.sendMailWelcome({ to: value.email })
      })

    // return
    return handleResponse(res, {
      status: StatusCodes.CREATED,
      message: 'User created successfully',
    })
  } catch (error) {
    next(error)
  }
})
authRouter.post('/signin', async (req, res, next) => {
  try {
    const body = req.body
    // validate
    const validate = auth_utils.schemaSignin.validate(body)
    if (validate.error) {
      throw createHttpError.BadRequest(validate.error.message)
    }

    // check exists user
    const userExists = await userModel.findOne({
      email: body.email,
    })

    if (!userExists) {
      throw createHttpError.NotFound('Invalid email or password')
    }

    // compare password
    const isMatchPassword = await auth_utils.comparePassword(
      body.password,
      userExists.password,
    )
    if (!isMatchPassword) {
      throw createHttpError.NotFound('Invalid email or password')
    }

    // create and save tokens
    const token = await auth_utils.generateSigninTokenAndSaveToken(res, {
      payload: { _id: userExists._id, role: userExists.role },
    })

    // return
    return handleResponse(res, {
      status: StatusCodes.OK,
      message: 'User signed in successfully',
      data: {
        user: userExists,
        access_token: token.access_token,
      },
    })
  } catch (error) {
    next(error)
  }
})
authRouter.delete('/signout', async (req, res, next) => {
  try {
    // clear token from cookie
    res.clearCookie('access_token')
    res.clearCookie('refresh_token')
    res.clearCookie('connect.sid')

    const getRefreshTokenFormCookie = req.cookies.refresh_token

    // remove refresh_token from database
    await userModel.findOneAndUpdate(
      {
        'tokens.token': getRefreshTokenFormCookie,
      },
      {
        $pull: {
          tokens: {
            token: getRefreshTokenFormCookie,
          },
        },
      },
      { new: true },
    )

    // return
    return handleResponse(res, {
      status: StatusCodes.OK,
      message: 'User logged out successfully',
      data: null,
    })
  } catch (error) {
    next(error)
  }
})
authRouter.put(`/forgot-password`, async (req, res, next) => {
  try {
    const body = req.body

    // validate data
    const validate = auth_utils.schemaForgotPassword.validate(body)
    if (validate.error) {
      throw createHttpError.BadRequest(validate.error.message)
    }

    //token
    const token = await auth_utils.generateResetPasswordTokenAndSaveToken(
      body.email,
    )

    // send email with link
    const makeLink =
      ENV_CONFIG.URL.URL_WEBSITE + `/reset-password/` + token.resetPasswordToken

    mail_service.sendMailForgotPassword({ to: body.email, link: makeLink })

    return handleResponse(res, {
      status: StatusCodes.OK,
      message: 'Check your email',
    })
  } catch (error) {
    next(error)
  }
})
authRouter.put(`/reset-password/:token`, async (req, res, next) => {
  try {
    const token = req.params.token
    const body = req.body

    // validate data
    const validate = auth_utils.schemaResetPassword.validate(body)
    if (validate.error) {
      throw createHttpError.BadRequest(validate.error.message)
    }

    const checkToken = await tokkenModel.findOne({ token }).populate('user')
    if (!checkToken) {
      throw createHttpError.NotFound('Invalid token')
    }

    const userExists = checkToken.user
    if (!userExists) {
      throw createHttpError.NotFound('Invalid token')
    }

    // hash password
    const hashedPassword = await auth_utils.hashPassword(body.new_password)

    // update password
    await userModel.findByIdAndUpdate(
      userExists._id,
      {
        password: hashedPassword,
      },
      { new: true },
    )

    // return
    return handleResponse(res, {
      status: StatusCodes.OK,
      message: 'Password reset successfully',
    })
  } catch (error) {
    next(error)
  }
})

// verifyToken
authRouter.put(`/change-password`, verifyToken, async (req, res, next) => {
  try {
    const user = req.user
    const body = req.body

    // validate data
    const validate = auth_utils.schemaChangePassword.validate(body)
    if (validate.error) {
      throw createHttpError.BadRequest(validate.error.message)
    }

    // hash password
    const hashedPassword = await auth_utils.hashPassword(body.new_password)

    // update password
    await userModel.findByIdAndUpdate(
      user?._id,
      { password: hashedPassword },
      { new: true },
    )

    // return
    return handleResponse(res, {
      status: StatusCodes.OK,
      message: 'Password updated successfully',
    })
  } catch (error) {
    next(error)
  }
})
authRouter.get(`/get-me`, verifyToken, async (req, res, next) => {
  try {
    const user = req.user

    const getData = await userModel.findById(user._id)

    // return
    return handleResponse(res, {
      status: StatusCodes.OK,
      message: 'User data fetched successfully',
      data: getData,
    })
  } catch (error) {
    next(error)
  }
})
authRouter.put(
  `/update-me`,
  upload.fields([
    {
      name: 'avatarFile',
      maxCount: 1,
    },
    {
      name: 'bannerFile',
      maxCount: 1,
    },
  ]),
  verifyToken,
  async (req, res, next) => {
    try {
      const user = req.user
      const body = req.body
      const files = req.files

      const avatarFile = files?.avatarFile?.[0]
      const bannerFile = files?.bannerFile?.[0]

      let avatar = body?.avatar
      let banner = body?.banner

      // upload
      if (avatarFile) {
        avatar = (await storage_service.cloudinary.upload_image(avatarFile)).url
        await storage_service.cloudinary.delete_image(body?.avatar)
      }
      if (bannerFile) {
        banner = (await storage_service.cloudinary.upload_image(bannerFile)).url
        await storage_service.cloudinary.delete_image(body?.banner)
      }

      // update data
      const updateData = await userModel.findByIdAndUpdate(
        user._id,
        {
          ...body,
          avatar,
          banner,
        },
        { new: true },
      )

      // return
      return handleResponse(res, {
        status: StatusCodes.OK,
        message: 'Profile updated successfully',
        data: updateData,
      })
    } catch (error) {
      next(error)
    }
  },
)
authRouter.post('/refresh-token', async (req, res, next) => {
  try {
    // get and check refresh token
    const refresh_token_cookie = req.cookies.refresh_token
    if (!refresh_token_cookie) {
      throw createHttpError.Unauthorized('Invalid refresh token')
    }

    const tokenInData = await tokkenModel.findOne({
      token: refresh_token_cookie,
      type: USER.TOKEN_TYPE.REFRESH_TOKEN,
      expires: {
        $gt: Date.now(),
      },
    })

    if (!tokenInData) {
      throw createHttpError.Unauthorized('Invalid refresh token')
    }

    jwt.verify(
      refresh_token_cookie,
      ENV_CONFIG.JWT.REFRESH_SECRET_KEY,
      async function (err, decode) {
        // if the refresh token
        if (err) {
          throw createHttpError.Unauthorized('Invalid refresh token')
        }

        // create and save tokens
        const token = await auth_utils.generateSigninTokenAndSaveToken(res, {
          payload: { _id: decode._id, role: decode.role },
        })

        // return
        return handleResponse(res, {
          status: StatusCodes.OK,
          message: 'Token refreshed successfully',
          data: {
            access_token: token.access_token,
          },
        })
      },
    )
  } catch (error) {
    next(error)
  }
})

export default authRouter
