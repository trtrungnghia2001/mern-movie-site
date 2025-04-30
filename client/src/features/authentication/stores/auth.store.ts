import { IAxiosResponseSuccess } from '@/types/response.type'
import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'

import ENV_CONFIG from '@/configs/env.config'
import axiosInstance from '@/configs/axios.config'
import {
  IChangePassword,
  IUser,
  SigninSocialMediaType,
} from '../types/user.type'

type Type = {
  user: IUser | null
  isLoggedIn: boolean
  signinWithSocialMedia: (type: SigninSocialMediaType) => void
  signinPassportSuccess: () => Promise<IAxiosResponseSuccess<IUser>>
  signout: () => Promise<IAxiosResponseSuccess>
  getMe: () => Promise<IAxiosResponseSuccess<IUser>>
  updateMe: (data: FormData) => Promise<IAxiosResponseSuccess<IUser>>
  changePassword: (
    data: IChangePassword,
  ) => Promise<IAxiosResponseSuccess<IChangePassword>>
}

export const useAuthStore = create<Type>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isLoggedIn: false,
        signinWithSocialMedia: (type) => {
          // const newWindowTab = window.open(
          //   ENV_CONFIG.URL_SERVER + `passport/${type}`,
          //   'targetWindow',
          //   `width=600,height=400`,
          // )
          // newWindowTab?.addEventListener('unload', function () {
          //   if (this.location.pathname === 'blank') {
          //     window.location.reload()
          //     this.close()
          //   }
          // })

          window.open(ENV_CONFIG.URL_SERVER + `passport/${type}`, `_blank`)
        },
        signinPassportSuccess: async () => {
          const url = `passport/signin-passport/success`
          const response = await axiosInstance.get(url)

          set({ user: response.data?.data?.user, isLoggedIn: true })

          return response.data
        },
        signout: async () => {
          const url = `auth/signout`
          const response = await axiosInstance.delete(url)
          set({ user: null, isLoggedIn: false })

          return response.data
        },

        getMe: async () => {
          const url = `auth/get-me`
          const response = await axiosInstance.get(url)
          set({ user: response.data?.data })
          return response.data
        },
        updateMe: async (data) => {
          const url = `auth/update-me`

          const response = await axiosInstance.put(url, data)

          set({ user: response.data?.data })
          return response?.data
        },
        changePassword: async (data) => {
          const url = `auth/change-password`
          const response = await axiosInstance.put(url, data)
          return response.data
        },
      }),
      {
        name: 'authStore',
        storage: createJSONStorage(() => localStorage),
      },
    ),
  ),
)
