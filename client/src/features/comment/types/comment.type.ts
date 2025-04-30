import { IUser } from '@/features/authentication/types/user.type'

export interface IComment {
  _id: string
  user: IUser
  data_type: string
  data_id: string
  parent_comment?: string
  message: string
  likes: string[]

  createdAt: string
}
