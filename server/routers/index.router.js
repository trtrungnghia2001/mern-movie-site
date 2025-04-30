import express from 'express'
import rootRouter from './root/index.router.js'
import apiRouter from './api/index.router.js'
import adminRouter from './admin/index.router.js'

const router = express.Router()

router.use(`/`, rootRouter)
router.use(`/`, apiRouter)
router.use(`/admin`, adminRouter)

export default router
