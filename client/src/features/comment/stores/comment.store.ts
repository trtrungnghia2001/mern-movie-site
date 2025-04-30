import { create } from 'zustand'
import { IComment } from '../types/comment.type'
import { IAxiosResponseSuccess } from '@/types/response.type'
import axiosInstance from '@/configs/axios.config'
import { IResponseList } from '@/types/list.type'

type Type = {
  comments: IComment[]
  createComment: (
    data: Partial<IComment>,
  ) => Promise<IAxiosResponseSuccess<IComment>>
  updateComment: (
    id: string,
    message: string,
  ) => Promise<IAxiosResponseSuccess<IComment>>
  likeComment: (
    data: Partial<IComment>,
  ) => Promise<IAxiosResponseSuccess<IComment>>
  deleteComment: (
    data: Partial<IComment>,
  ) => Promise<IAxiosResponseSuccess<IComment>>
  getComments: (
    query?: string,
  ) => Promise<IAxiosResponseSuccess<IResponseList<IComment>>>
  getCommentsByUser: (
    query?: string,
  ) => Promise<IAxiosResponseSuccess<IResponseList<IComment>>>
}

export const useCommentStore = create<Type>()((set, get) => ({
  comments: [],
  total_delete: 0,
  total_comments: 0,
  createComment: async (data) => {
    const url = `comment/create`
    const response = await axiosInstance.post(url, data)
    set({
      comments: [response?.data?.data, ...get().comments],
    })
    return response.data
  },
  updateComment: async (id, message) => {
    const url = `comment/update/${id}`
    const response = await axiosInstance.put(url, { message })
    set({
      comments: get().comments.map((comment) =>
        comment._id === id ? { ...comment, message } : comment,
      ),
    })
    return response.data
  },
  likeComment: async (data) => {
    const url = `comment/like-unlike/${data._id}`
    const response = await axiosInstance.put(url, data)
    return response.data
  },
  deleteComment: async (data) => {
    const url = `comment/delete/${data._id}`
    const response = await axiosInstance.delete(url)
    set({
      comments: get().comments.filter((item) => {
        return item._id !== data._id
      }),
    })
    return response.data
  },
  getComments: async (query?: string) => {
    const url = `comment/get-comments?` + (query || '')
    const response = await axiosInstance.get(url)
    set({
      comments: response.data?.data?.results,
    })
    return response.data
  },
  getCommentsByUser: async (query?: string) => {
    const url = `comment/get-comments-by-user?` + (query || '')
    const response = await axiosInstance.get(url)
    set({
      comments: response.data?.data?.results,
    })
    return response.data
  },
}))
