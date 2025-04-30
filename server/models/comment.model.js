import mongoose, { Schema } from 'mongoose'

// comment schema
const commentSchema = new Schema(
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
    message: {
      type: String,
      required: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
  },
  {
    timestamps: true,
  },
)

const commentModel =
  mongoose.models.comment || mongoose.model('comment', commentSchema)

export default commentModel
