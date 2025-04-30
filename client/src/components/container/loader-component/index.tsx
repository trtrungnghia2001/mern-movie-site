import React, { memo } from 'react'
import style from './style.module.css'

const LoaderComponent = () => {
  return (
    <div className="z-[2000] fixed inset-0 top-0 left-0 bottom-0 right-0 bg-black/50 flex items-center justify-center">
      <span className={style.loader}></span>
    </div>
  )
}

export default memo(LoaderComponent)
