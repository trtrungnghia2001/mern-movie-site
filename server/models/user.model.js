import mongoose, { Schema } from 'mongoose'
import { USER } from '#server/helpers/constants.helper'

const userSchema = new Schema(
  {
    // basic
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(USER.ROLE),
      default: USER.ROLE.USER,
      required: true,
    },

    // provider
    providers: [
      {
        provider: {
          type: String,
          enum: Object.values(USER.PROVIDER_TYPE),
          required: true,
        },
        id: { type: String, required: true },
      },
    ],

    // file
    avatar: {
      type: String,
    },
    banner: {
      type: String,
    },

    // info
    name: {
      type: String,
      required: true,
    },
    nickname: {
      type: String,
    },
    phone_number: {
      type: String,
    },
    address: {
      type: String,
    },
    date_of_birth: {
      type: String,
    },
    email_address: {
      type: String,
    },
    gender: {
      type: String,
      enum: Object.values(USER.GENDER),
      default: USER.GENDER.OTHER,
    },
    bio: {
      type: String,
    },

    // social media
    link_website: {
      type: String,
    },
    link_instagram: {
      type: String,
    },
    link_facebook: {
      type: String,
    },
    link_twitter: {
      type: String,
    },
    link_linkedin: {
      type: String,
    },
    link_pinterest: {
      type: String,
    },
    link_youtube: {
      type: String,
    },
    link_github: {
      type: String,
    },

    // work and education
    work: {
      type: String,
    },
    education: {
      type: String,
    },
    skills: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
)

const userModel = mongoose.models.user || mongoose.model('user', userSchema)

export default userModel
