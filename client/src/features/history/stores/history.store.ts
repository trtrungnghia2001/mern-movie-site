import { IAxiosResponseSuccess } from '@/types/response.type'
import { IHistory } from '../types/history.store'
import { IResponseList } from '@/types/list.type'
import { create } from 'zustand'
import axiosInstance from '@/configs/axios.config'

type Type = {
  histories: IHistory[] | []
  checkHistory: (query?: string) => Promise<IAxiosResponseSuccess<IHistory>>
  addHistory: (data: IHistory) => Promise<IAxiosResponseSuccess<IHistory>>
  removeHistories: (query?: string) => Promise<IAxiosResponseSuccess>
  getHistories: (
    query?: string,
  ) => Promise<IAxiosResponseSuccess<IResponseList<IHistory>>>
}

export const useHistoryStore = create<Type>()((set) => ({
  histories: [],
  checkHistory: async (query) => {
    const url = `history/check?` + (query || '')
    const response = await axiosInstance.get(url)
    return response.data
  },
  removeHistories: async (query) => {
    const url = `history/remove-all?` + (query || '')
    const response = await axiosInstance.delete(url)
    set({
      histories: [],
    })
    return response.data
  },
  addHistory: async (data) => {
    const url = `history/add`
    const response = await axiosInstance.post(url, data)
    return response.data
  },
  getHistories: async (query) => {
    const url = `history/all?` + (query || '')
    const response = await axiosInstance.get(url)
    set({
      histories: response.data?.data?.results,
    })
    return response.data
  },
}))
