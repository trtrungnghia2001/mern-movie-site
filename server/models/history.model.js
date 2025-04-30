import mongoose, { Schema } from 'mongoose'

const historySchema = new Schema(
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
    chapter_id: {
      type: String,
    },
    episode: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
)

const historyModel =
  mongoose.models.history || mongoose.model('history', historySchema)

export default historyModel
