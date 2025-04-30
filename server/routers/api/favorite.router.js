import { QUERY_PARAMETER } from '#server/helpers/constants.helper'
import { handleResponse } from '#server/helpers/responses.helper'
import favoriteModel from '#server/models/favorite.model'
import express from 'express'
import { StatusCodes } from 'http-status-codes'

const favoriteRouter = express.Router()

favoriteRouter.get('/check', async (req, res, next) => {
  try {
    const data_id = req.query.data_id
    const data_type = req.query.data_type
    const user = req.user

    const filter = {
      user: user._id,
      data_id,
      data_type,
    }

    // check data
    const dataExists = await favoriteModel.findOne(filter)

    // return
    return handleResponse(res, {
      status: StatusCodes.OK,
      message: 'Favorite data fetched successfully',
      data: dataExists,
    })
  } catch (error) {
    next(error)
  }
})

favoriteRouter.post('/toggle', async (req, res, next) => {
  try {
    const body = req.body
    const user = req.user

    const filter = {
      user: user._id,
      ...body,
    }

    // check data
    const dataExists = await favoriteModel.findOne(filter)

    if (dataExists) {
      const deleteData = await favoriteModel.findOneAndDelete(filter, {
        new: true,
      })
      return handleResponse(res, {
        status: StatusCodes.OK,
        message: 'Removed successfully',
        data: deleteData,
      })
    } else {
      const createData = await favoriteModel.create({ ...body, user: user._id })
      return handleResponse(res, {
        status: StatusCodes.CREATED,
        message: 'Added successfully',
        data: createData,
      })
    }
  } catch (error) {
    next(error)
  }
})

favoriteRouter.get('/all', async (req, res, next) => {
  try {
    const _q = req.query._q || QUERY_PARAMETER._Q
    const _sort = req.query._sort || QUERY_PARAMETER._SORT
    const _page = parseInt(req.query._page) || QUERY_PARAMETER._PAGE
    const _limit = parseInt(req.query._limit) || QUERY_PARAMETER._LIMIT

    const user = req.user

    const filter = {
      user: user._id,
      data_type: req.query.data_type,
    }

    const getDatas = await favoriteModel
      .find(filter)
      .limit(_limit)
      .skip((_page - 1) * _limit)
      .sort({
        createdAt: -1,
      })

    const total_rows = await favoriteModel.countDocuments(filter)
    const total_pages = Math.ceil(total_rows / _limit)

    return handleResponse(res, {
      status: StatusCodes.OK,
      message: 'Favorite data fetched successfully',
      data: {
        results: getDatas,
        pagination: {
          total_rows,
          total_pages,
          _page,
          _limit,
        },
        filters: {
          _q,
          _sort,
        },
      },
    })
  } catch (error) {
    next(error)
  }
})

export default favoriteRouter
