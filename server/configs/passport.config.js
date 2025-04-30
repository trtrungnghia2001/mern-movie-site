import passportConfig from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Strategy as GithubStrategy } from 'passport-github2'
import ENV_CONFIG from './env.config.js'
import userModel from '#server/models/user.model'
import { USER } from '#server/helpers/constants.helper'
import { auth_utils } from '#server/utils/auth.util'

// google
passportConfig.use(
  new GoogleStrategy(
    {
      clientID: ENV_CONFIG.PASSPORT.GOOGLE_CLIENT_ID,
      clientSecret: ENV_CONFIG.PASSPORT.GOOGLE_CLIENT_SECRET,
      callbackURL: ENV_CONFIG.PASSPORT.GOOGLE_CALLBACK_URL,
      scope: [`profile`, `email`],
    },
    async function (accessToken, refreshToken, profile, done) {
      const body = profile._json

      // check exists user
      let userExists = await userModel.findOne({
        email: body.email,
      })
      if (!userExists) {
        // hash password
        const hashedPassword = await auth_utils.hashPassword(String(body.sub))
        userExists = await userModel
          .create({
            email: body.email,
            password: hashedPassword,
            name: body.name,
            avatar: body.picture,
          })
          .then(async (value) => {
            return await userModel.findByIdAndUpdate(
              value._id,
              {
                $push: {
                  providers: {
                    provider: USER.PROVIDER_TYPE.GOOGLE,
                    id: body.sub,
                  },
                },
              },
              {
                new: true,
              },
            )
          })
      }
      // check provider when user exists but not linked with google
      const provider = userExists.providers.find(
        (item) => item.provider === USER.PROVIDER_TYPE.GOOGLE,
      )
      if (!provider) {
        userExists = await userModel.findByIdAndUpdate(
          userExists._id,
          {
            $push: {
              providers: {
                provider: USER.PROVIDER_TYPE.GOOGLE,
                id: body.sub,
              },
            },
          },
          {
            new: true,
          },
        )
      }

      done(null, userExists)
    },
  ),
)
// github
passportConfig.use(
  new GithubStrategy(
    {
      clientID: ENV_CONFIG.PASSPORT.GITHUB_CLIENT_ID,
      clientSecret: ENV_CONFIG.PASSPORT.GITHUB_CLIENT_SECRET,
      callbackURL: ENV_CONFIG.PASSPORT.GITHUB_CALLBACK_URL,
      scope: ['user:email'],
    },
    async function (accessToken, refreshToken, profile, done) {
      const body = { ...profile._json, email: profile.emails[0].value }

      // // check exists user
      let userExists = await userModel.findOne({
        email: body.email,
      })
      if (!userExists) {
        // hash password
        const hashedPassword = await auth_utils.hashPassword(String(body.id))
        userExists = await userModel
          .create({
            email: body.email,
            password: hashedPassword,
            name: body.login,
            avatar: body.avatar_url,
          })
          .then(async (value) => {
            return await userModel.findByIdAndUpdate(
              value._id,
              {
                $push: {
                  providers: {
                    provider: USER.PROVIDER_TYPE.GITHUB,
                    id: body.id,
                  },
                },
              },
              {
                new: true,
              },
            )
          })
      }
      // check provider when user exists but not linked with github
      const provider = userExists.providers.find(
        (item) => item.provider === USER.PROVIDER_TYPE.GITHUB,
      )
      if (!provider) {
        userExists = await userModel.findByIdAndUpdate(
          userExists._id,
          {
            $push: {
              providers: {
                provider: USER.PROVIDER_TYPE.GITHUB,
                id: body.id,
              },
            },
          },
          {
            new: true,
          },
        )
      }

      done(null, userExists)
    },
  ),
)

passportConfig.serializeUser(function (user, done) {
  done(null, user)
})
passportConfig.deserializeUser(function (user, done) {
  done(null, user)
})

export default passportConfig
