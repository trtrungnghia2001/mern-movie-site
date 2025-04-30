import React, { memo, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const AutoTopComponent = () => {
  const location = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])
  return <></>
}

export default memo(AutoTopComponent)
