import React, { memo, useEffect, useState } from 'react'
import { AiFillLike } from 'react-icons/ai'
import { ILike } from '../types/like.type'
import { useLikeStore } from '../stores/like.store'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import LoaderComponent from '@/components/container/loader-component'

const ButtonLike = ({ data, isLike }: { isLike: boolean; data: ILike }) => {
  const [checked, setChecked] = useState(false)
  useEffect(() => {
    setChecked(isLike)
  }, [isLike])

  const { toggleLike } = useLikeStore()
  const toggleLikeResult = useMutation({
    mutationFn: async () => {
      return await toggleLike(data)
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
      {toggleLikeResult.isPending && <LoaderComponent />}
      <button
        onClick={() => toggleLikeResult.mutate()}
        className="flex items-center gap-1 px-3 py-1.5 rounded bg-purple-500 text-white transition hover:opacity-80"
      >
        <AiFillLike />
        {checked ? 'Hủy thích' : 'Thích'}
      </button>
    </>
  )
}

export default memo(ButtonLike)
