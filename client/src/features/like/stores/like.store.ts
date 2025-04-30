import { IAxiosResponseSuccess } from '@/types/response.type'

import { create } from 'zustand'
import axiosInstance from '@/configs/axios.config'
import { IResponseList } from '@/types/list.type'
import { ILike } from '../types/like.type'

type Type = {
  likes: ILike[] | []
  checkLike: (query?: string) => Promise<IAxiosResponseSuccess<ILike>>
  toggleLike: (data: ILike) => Promise<IAxiosResponseSuccess<ILike>>
  getLikes: (
    query?: string,
  ) => Promise<IAxiosResponseSuccess<IResponseList<ILike>>>
}

export const useLikeStore = create<Type>()((set) => ({
  likes: [],
  checkLike: async (query) => {
    const url = `like/check?` + (query || '')
    const response = await axiosInstance.get(url)
    return response.data
  },
  toggleLike: async (data) => {
    const url = `like/toggle`
    const response = await axiosInstance.post(url, data)
    return response.data
  },
  getLikes: async (query) => {
    const url = `like/all?` + (query || '')
    const response = await axiosInstance.get(url)
    set({
      likes: response.data?.data?.results,
    })
    return response.data
  },
}))
