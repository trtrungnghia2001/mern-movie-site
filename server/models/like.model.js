import mongoose, { Schema } from 'mongoose'

const likeSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    data_id: {
      type: String,
      required: true,
    },
    data_type: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

const likeModel = mongoose.models.like || mongoose.model('like', likeSchema)

export default likeModel
