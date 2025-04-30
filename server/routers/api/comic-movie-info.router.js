import { handleResponse } from '#server/helpers/responses.helper'
import favoriteModel from '#server/models/favorite.model'
import historyModel from '#server/models/history.model'
import likeModel from '#server/models/like.model'
import express from 'express'
import { StatusCodes } from 'http-status-codes'

const comicMovieInfoRouter = express.Router()

comicMovieInfoRouter.get(`/:id/:type`, async (req, res, next) => {
  try {
    const { id, type } = req.params
    const tracking_id = req.query.tracking_id

    let filter = {
      user: tracking_id,
      data_id: id,
      data_type: type,
    }

    const isLike = (await likeModel.findOne(filter)) ? true : false
    const isFavorite = (await favoriteModel.findOne(filter)) ? true : false
    const isHistory = (await historyModel.findOne(filter)) ? true : false

    const chapter_id = (await historyModel.findOne(filter))?.chapter_id

    filter = {
      data_id: id,
      data_type: type,
    }

    const count_views = await historyModel.countDocuments(filter)
    const count_likes = await likeModel.countDocuments(filter)
    const count_favorites = await favoriteModel.countDocuments(filter)

    return handleResponse(res, {
      status: StatusCodes.OK,
      message: 'Comic Movie Info fetched successfully',
      data: {
        isLike,
        isFavorite,
        isHistory,
        count_likes,
        count_favorites,
        count_views,
        chapter_id,
      },
    })
  } catch (error) {
    next(error)
  }
})

export default comicMovieInfoRouter
