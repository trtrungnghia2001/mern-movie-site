import upload from '#server/configs/multer.config'
import { handleResponse } from '#server/helpers/responses.helper'
import storage_service from '#server/services/storage.service'
import express from 'express'
import { StatusCodes } from 'http-status-codes'

export const uploadRouter = express.Router()

uploadRouter.post('/single', upload.single('file'), async (req, res, next) => {
  try {
    const file = req.file

    const fileUpload = await storage_service.cloudinary.upload_image(file)

    return handleResponse(res, {
      status: StatusCodes.OK,
      message: 'File uploaded successfully',
      data: fileUpload,
    })
  } catch (error) {
    next(error)
  }
})
uploadRouter.post('/array', upload.array('files'), async (req, res, next) => {
  try {
    const files = req.files

    const filesUpload = await Promise.all(
      files.map(async (file) => {
        return await storage_service.cloudinary.upload_image(file)
      }),
    )

    return handleResponse(res, {
      status: StatusCodes.OK,
      message: 'Files uploaded successfully',
      data: filesUpload,
    })
  } catch (error) {
    next(error)
  }
})
uploadRouter.post(
  '/fields',
  upload.fields([
    {
      name: 'files1',
    },
    {
      name: 'files2',
    },
  ]),
  async (req, res, next) => {
    try {
      const files = req.files
      const files1 = files.files1
      const files2 = files.files2

      const files1Upload = await Promise.all(
        files1.map(async (file) => {
          return await storage_service.cloudinary.upload_image(file)
        }),
      )
      const files2Upload = await Promise.all(
        files2.map(async (file) => {
          return await storage_service.cloudinary.upload_image(file)
        }),
      )

      return handleResponse(res, {
        status: StatusCodes.OK,
        message: 'Files uploaded successfully',
        data: {
          files1: files1Upload,
          files2: files2Upload,
        },
      })
    } catch (error) {
      next(error)
    }
  },
)
uploadRouter.delete('/delete', async (req, res, next) => {
  try {
    const url = req.query?.url

    const fileDelete = await storage_service.cloudinary.delete_image(url)

    return handleResponse(res, {
      status: StatusCodes.OK,
      message: 'File deleted successfully',
      data: fileDelete,
    })
  } catch (error) {
    next(error)
  }
})
export default uploadRouter
