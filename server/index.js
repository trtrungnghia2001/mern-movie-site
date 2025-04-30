import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import session from 'express-session'
import cors from 'cors'

import passportConfig from './configs/passport.config.js'
import { connectMongoDB } from './configs/database.config.js'
import { connectRedis } from './configs/redis.config.js'
import ENV_CONFIG from './configs/env.config.js'
import { handleError } from './helpers/responses.helper.js'
import router from './routers/index.router.js'

// connect database
await connectMongoDB()
await connectRedis()

const app = express()
const isProduction = ENV_CONFIG.NODE_ENV === 'production'
// cors
app.use(
  cors({
    origin: [`http://localhost:5173`, ENV_CONFIG.URL.URL_WEBSITE],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    optionsSuccessStatus: 200,
  }),
)
app.use(cookieParser())
app.use(
  bodyParser.json({
    limit: '50mb',
  }),
)
// session
app.use(
  session({
    secret: ENV_CONFIG.PASSPORT.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      ...(isProduction && {
        sameSite: 'none',
        secure: true,
      }),
    },
  }),
)

// passport
app.use(passport.initialize())
app.use(passport.session())

// routes
app.use(`/api`, router)

// port
app.listen(ENV_CONFIG.PORT.SERVER, function () {
  console.log(`Server is running on port ${ENV_CONFIG.PORT.SERVER}`)
})

// error handler
app.use(handleError)
