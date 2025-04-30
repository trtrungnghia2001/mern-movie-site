import { OphimCardLayoutType } from '@/types/ophim.type'
import React, { memo } from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const MovieCardSkeleton = ({ layout }: { layout?: OphimCardLayoutType }) => {
  if (layout === 'vertical')
    return (
      <div className="block bg-color-bg-item">
        <SkeletonTheme baseColor="rgb(15,14,14)" highlightColor="rgb(0,0,0)">
          <div className="flex items-start">
            <Skeleton className="aspect-thumbnail-2 w-16" />
            <div className="flex-1 p-3">
              <Skeleton count={2} height={8} className="w-20 block" />
            </div>
          </div>
        </SkeletonTheme>
      </div>
    )
  return (
    <div className="block">
      <SkeletonTheme baseColor="rgb(15,14,14)" highlightColor="rgb(0,0,0)">
        <Skeleton className="aspect-thumbnail-1" />
        <Skeleton count={2} height={8} />
      </SkeletonTheme>
    </div>
  )
}

export default memo(MovieCardSkeleton)
