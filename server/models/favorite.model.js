import mongoose, { Schema } from 'mongoose'

const favoriteSchema = new Schema(
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

const favoriteModel =
  mongoose.models.favorite || mongoose.model('favorite', favoriteSchema)

export default favoriteModel
