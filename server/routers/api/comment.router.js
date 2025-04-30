import { QUERY_PARAMETER } from '#server/helpers/constants.helper'
import { handleResponse } from '#server/helpers/responses.helper'
import express from 'express'
import { StatusCodes } from 'http-status-codes'
import commentModel from '#server/models/comment.model'
import { verifyToken } from '#server/middlewares/verifyToken.middleware'

const commentRouter = express.Router()

commentRouter.post(`/create`, verifyToken, async (req, res, next) => {
  try {
    const body = req.body
    const user = req.user

    const newData = await commentModel
      .create({ ...body, user: user._id })
      .then((doc) => doc.populate('user'))

    return handleResponse(res, {
      status: StatusCodes.CREATED,
      message: 'Comment created successfully',
      data: newData,
    })
  } catch (error) {
    next(error)
  }
})
commentRouter.get(`/get-comments`, async (req, res, next) => {
  try {
    const _skip = req.query._q || QUERY_PARAMETER._SKIP
    const _q = req.query._q || QUERY_PARAMETER._Q
    const _sort = req.query._sort || QUERY_PARAMETER._SORT
    const _page = parseInt(req.query._page) || QUERY_PARAMETER._PAGE
    const _limit = parseInt(req.query._limit) || QUERY_PARAMETER._LIMIT

    const filter = {
      data_type: req.query.data_type,
      data_id: req.query?.data_id,
    }

    const getDatas = await commentModel
      .find(filter)
      .populate([
        {
          path: 'user',
        },
      ])
      .limit(_limit)
      .skip((_page - 1) * _limit + _skip)
      .sort({
        createdAt: -1,
      })

    const total_rows = await commentModel.countDocuments(filter)
    const total_pages = Math.ceil(total_rows / _limit)

    return handleResponse(res, {
      status: StatusCodes.OK,
      message: 'Comment data fetched successfully',
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
commentRouter.put(`/update/:id`, verifyToken, async (req, res, next) => {
  try {
    const body = req.body
    const user = req.user

    const comment = await commentModel.findByIdAndUpdate(
      req.params.id,
      { ...body },
      { new: true },
    )

    return handleResponse(res, {
      status: StatusCodes.OK,
      message: 'Comment updated successfully',
      data: comment,
    })
  } catch (error) {
    next(error)
  }
})
commentRouter.put(`/like-unlike/:id`, verifyToken, async (req, res, next) => {
  try {
    const user = req.user

    const filter = {
      _id: req.params.id,
      likes: user._id,
    }

    const like = await commentModel.findOne(filter)

    if (like) {
      const updatedComment = await commentModel.findOneAndUpdate(
        filter,
        {
          $pull: { likes: user._id },
        },
        {
          new: true,
        },
      )
      return handleResponse(res, {
        status: StatusCodes.OK,
        message: 'Like removed successfully',
        data: updatedComment,
      })
    } else {
      const updatedComment = await commentModel.findByIdAndUpdate(
        req.params.id,
        {
          $push: { likes: user._id },
        },
        {
          new: true,
        },
      )
      return handleResponse(res, {
        status: StatusCodes.OK,
        message: 'Like added successfully',
        data: updatedComment,
      })
    }
  } catch (error) {
    next(error)
  }
})
commentRouter.delete(`/delete/:id`, verifyToken, async (req, res, next) => {
  try {
    const deletedComment = await commentModel.findByIdAndDelete(req.params.id, {
      new: true,
    })

    return handleResponse(res, {
      status: StatusCodes.OK,
      message: 'Comment deleted successfully',
      data: deletedComment,
    })
  } catch (error) {
    next(error)
  }
})
commentRouter.get(
  `/get-comments-by-user`,
  verifyToken,
  async (req, res, next) => {
    try {
      const _q = req.query._q || QUERY_PARAMETER._Q
      const _sort = req.query._sort || QUERY_PARAMETER._SORT
      const _page = parseInt(req.query._page) || QUERY_PARAMETER._PAGE
      const _limit = parseInt(req.query._limit) || QUERY_PARAMETER._LIMIT

      const filter = {
        user: req.user._id,
        data_type: req.query.data_type,
      }

      const getDatas = await commentModel
        .find(filter)
        .populate([
          {
            path: 'user',
            select: ['-tokens', '-providers'],
          },
        ])
        .limit(_limit)
        .skip((_page - 1) * _limit)
        .sort({
          createdAt: -1,
        })

      const total_rows = await commentModel.countDocuments(filter)
      const total_pages = Math.ceil(total_rows / _limit)

      return handleResponse(res, {
        status: StatusCodes.OK,
        message: 'Comment data fetched successfully',
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
  },
)

export default commentRouter
