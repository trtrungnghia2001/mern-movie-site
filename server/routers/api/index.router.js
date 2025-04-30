import express from 'express'
import { verifyToken } from '#server/middlewares/verifyToken.middleware'
import favoriteRouter from './favorite.router.js'
import likeRouter from './like.router.js'
import historyRouter from './history.router.js'
import commentRouter from './comment.router.js'
import comicMovieInfoRouter from './comic-movie-info.router.js'

const apiRouter = express.Router()

apiRouter.use('/comic-movie-info', comicMovieInfoRouter)
apiRouter.use('/favorite', verifyToken, favoriteRouter)
apiRouter.use('/like', verifyToken, likeRouter)
apiRouter.use('/history', verifyToken, historyRouter)
apiRouter.use('/comment', commentRouter)

export default apiRouter
