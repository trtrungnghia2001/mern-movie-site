import { USER } from '#server/helpers/constants.helper'
import mongoose, { Schema } from 'mongoose'

const tokenSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'user' },
    token: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: Object.values(USER.TOKEN_TYPE),
    },
    expires: { type: Date, required: true },
  },
  {
    timestamps: true,
  },
)

const tokkenModel =
  mongoose.models.token || mongoose.model('token', tokenSchema)

export default tokkenModel
