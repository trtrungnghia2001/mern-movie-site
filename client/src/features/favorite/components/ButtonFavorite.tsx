import React, { memo, useEffect, useState } from 'react'
import { MdFavorite } from 'react-icons/md'
import { IFavorite } from '../types/favorite.type'
import { useFavoriteStore } from '../stores/favorite.store'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import LoaderComponent from '@/components/container/loader-component'

const ButtonFavorite = ({
  data,
  isFavorite,
}: {
  isFavorite: boolean
  data: IFavorite
}) => {
  const [checked, setChecked] = useState(false)
  useEffect(() => {
    setChecked(isFavorite)
  }, [isFavorite])

  const { toggleFavorite } = useFavoriteStore()
  const toggleFavoriteResult = useMutation({
    mutationFn: async () => {
      return await toggleFavorite(data)
    },
    onSuccess: (data) => {
      toast.success(data.message)
      setChecked(!checked)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  return (
    <>
      {toggleFavoriteResult.isPending && <LoaderComponent />}
      <button
        onClick={() => toggleFavoriteResult.mutate()}
        className="flex items-center gap-1 px-3 py-1.5 rounded bg-red-500 text-white transition hover:opacity-80"
      >
        <MdFavorite />
        {checked ? 'Hủy theo dõi' : 'Theo dõi'}
      </button>
    </>
  )
}

export default memo(ButtonFavorite)
