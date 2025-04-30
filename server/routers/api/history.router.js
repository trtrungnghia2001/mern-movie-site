import historyModel from '#server/models/history.model'
import { QUERY_PARAMETER } from '#server/helpers/constants.helper'
import { handleResponse } from '#server/helpers/responses.helper'
import express from 'express'
import { StatusCodes } from 'http-status-codes'

const historyRouter = express.Router()

historyRouter.get('/check', async (req, res, next) => {
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
    const dataExists = await historyModel.findOne(filter)

    // return
    return handleResponse(res, {
      status: StatusCodes.OK,
      message: 'History data fetched successfully',
      data: dataExists,
    })
  } catch (error) {
    next(error)
  }
})

historyRouter.post('/add', async (req, res, next) => {
  try {
    const user = req.user
    const body = req.body

    const filter = {
      user: user._id,
      data_id: body.data_id,
      data_type: body.data_type,
    }

    // check data
    const dataExists = await historyModel.findOne(filter)

    if (dataExists) {
      const updateData = await historyModel.findOneAndUpdate(
        filter,
        {
          chapter_id: body.chapter_id,
          updatedAt: new Date(),
          createdAt: new Date(),
        },
        { new: true },
      )
      return handleResponse(res, {
        status: StatusCodes.CREATED,
        message: 'History added successfully',
        data: updateData,
      })
    } else {
      const createData = await historyModel.create({ ...body, user: user._id })
      return handleResponse(res, {
        status: StatusCodes.CREATED,
        message: 'History added successfully',
        data: createData,
      })
    }
  } catch (error) {
    next(error)
  }
})

historyRouter.delete('/remove-all', async (req, res, next) => {
  try {
    const user = req.user

    const filter = {
      user: user._id,
      data_type: req.query.data_type,
    }

    const deleteDatas = await historyModel.deleteMany(filter)
    return handleResponse(res, {
      status: StatusCodes.OK,
      message: 'All history data removed successfully',
      data: deleteDatas,
    })
  } catch (error) {
    next(error)
  }
})

historyRouter.get('/all', async (req, res, next) => {
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

    const getDatas = await historyModel
      .find(filter)
      .limit(_limit)
      .skip((_page - 1) * _limit)
      .sort({
        createdAt: -1,
      })

    const total_rows = await historyModel.countDocuments(filter)
    const total_pages = Math.ceil(total_rows / _limit)

    return handleResponse(res, {
      status: StatusCodes.OK,
      message: 'History data fetched successfully',
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

export default historyRouter
