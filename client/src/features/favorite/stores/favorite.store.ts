import { IAxiosResponseSuccess } from '@/types/response.type'
import { IFavorite } from '../types/favorite.type'
import { create } from 'zustand'
import axiosInstance from '@/configs/axios.config'
import { IResponseList } from '@/types/list.type'

type Type = {
  favorites: IFavorite[] | []
  checkFavorite: (query?: string) => Promise<IAxiosResponseSuccess<IFavorite>>
  toggleFavorite: (data: IFavorite) => Promise<IAxiosResponseSuccess<IFavorite>>
  getFavorites: (
    query?: string,
  ) => Promise<IAxiosResponseSuccess<IResponseList<IFavorite>>>
}

export const useFavoriteStore = create<Type>()((set) => ({
  favorites: [],
  checkFavorite: async (query) => {
    const url = `favorite/check?` + (query || '')
    const response = await axiosInstance.get(url)
    return response.data
  },
  toggleFavorite: async (data) => {
    const url = `favorite/toggle`
    const response = await axiosInstance.post(url, data)
    return response.data
  },
  getFavorites: async (query) => {
    const url = `favorite/all?` + (query || '')
    const response = await axiosInstance.get(url)
    set({
      favorites: response.data?.data?.results,
    })
    return response.data
  },
}))
