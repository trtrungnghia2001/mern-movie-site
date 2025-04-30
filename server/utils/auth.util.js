import Joi from 'joi'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import cryptojs from 'crypto-js'
import ENV_CONFIG from '#server/configs/env.config'
import userModel from '#server/models/user.model'
import { USER } from '#server/helpers/constants.helper'
import tokkenModel from '#server/models/token.model'

export const auth_utils = {
  // schema
  schemaSignup: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().pattern(new RegExp(`@gmail.com`)).email().required(),
    password: Joi.string().required(),
    confirm_password: Joi.string().valid(Joi.ref('password')).required(),
  }),
  schemaSignin: Joi.object({
    email: Joi.string().pattern(new RegExp(`@gmail.com`)).email().required(),
    password: Joi.string().required(),
  }),
  schemaChangePassword: Joi.object({
    new_password: Joi.string().required(),
    confirm_new_password: Joi.string()
      .valid(Joi.ref('new_password'))
      .required(),
  }),
  schemaForgotPassword: Joi.object({
    email: Joi.string().pattern(new RegExp(`@gmail.com`)).email().required(),
  }),
  schemaResetPassword: Joi.object({
    new_password: Joi.string().required(),
    confirm_new_password: Joi.string()
      .valid(Joi.ref('new_password'))
      .required(),
  }),

  hashPassword: async function (password) {
    const salt = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash(password, salt)
    return hashedPassword
  },
  comparePassword: async function (plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword)
  },

  // jwt
  generateSigninTokenAndSaveToken: async function (res, { payload }) {
    // generate token
    const access_token = await jwt.sign(
      { ...payload },
      ENV_CONFIG.JWT.SECRET_KEY,
      {
        expiresIn: ENV_CONFIG.JWT.SECRET_EXPIRES,
      },
    )
    const refresh_token = await jwt.sign(
      { ...payload },
      ENV_CONFIG.JWT.REFRESH_SECRET_KEY,
      {
        expiresIn: ENV_CONFIG.JWT.REFRESH_SECRET_EXPIRES,
      },
    )

    const isProduction = ENV_CONFIG.NODE_ENV === 'production'
    // save tokens to cookie
    res.cookie(`access_token`, access_token, {
      httpOnly: isProduction,
      secure: true,
      sameSite: 'None',
      maxAge: 1000 * 60 * 60 * 24 * 1, // 1day
    })
    res.cookie(`refresh_token`, refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 1000 * 60 * 60 * 24 * 2, // 2day
    })

    // remove refresh_token and create from database
    let filter = {
      user: payload?._id,
      type: USER.TOKEN_TYPE.REFRESH_TOKEN,
    }
    let expires = Date.now() + 1000 * 60 * 60 * 24 * 2 //2day

    const checkToken = await tokkenModel.findOne(filter)

    if (checkToken) {
      await tokkenModel.findOneAndUpdate(
        filter,
        {
          token: refresh_token,
          expires: expires,
        },
        { new: true },
      )
    } else {
      await tokkenModel.create({
        ...filter,
        token: refresh_token,
        expires: expires,
      })
    }

    // remove token when expired
    await tokkenModel.deleteMany({
      expires: { $lt: Date.now() },
    })

    // return tokens
    return { access_token, refresh_token }
  },
  generateResetPasswordTokenAndSaveToken: async function (email) {
    // generate token
    const resetPasswordToken = await cryptojs.SHA256(email).toString()
    let expires = Date.now() + 1000 * 60 * 5 // 5 minute

    const payload = await userModel.findOne({ email }) // user

    let filter = {
      user: payload?._id,
      type: USER.TOKEN_TYPE.REFRESH_PASSWORD_TOKEN,
    }

    const checkToken = await tokkenModel.findOne(filter)

    // remove and create refresh_password_token from database
    if (checkToken) {
      await tokkenModel.findOneAndUpdate(
        filter,
        {
          token: resetPasswordToken,
          expires: expires,
        },
        { new: true },
      )
    } else {
      await tokkenModel.create({
        ...filter,
        token: resetPasswordToken,
        expires: expires,
      })
    }

    // return tokens
    return { resetPasswordToken }
  },
}
