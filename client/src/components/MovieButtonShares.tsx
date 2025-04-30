import React, { memo } from 'react'
import {
  FacebookShareButton,
  TwitterShareButton,
  RedditShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  RedditIcon,
  TelegramIcon,
} from 'react-share'

const MovieButtonShares = () => {
  const url_share = window.location.href
  return (
    <article className="border-y border-color-border py-2 flex flex-wrap items-center gap-4">
      <span>Share</span>
      <FacebookShareButton url={url_share}>
        <FacebookIcon size={28} className="rounded" />
      </FacebookShareButton>
      <TwitterShareButton url={url_share}>
        <TwitterIcon size={28} className="rounded" />
      </TwitterShareButton>
      <WhatsappShareButton url={url_share}>
        <WhatsappIcon size={28} className="rounded" />
      </WhatsappShareButton>
      <RedditShareButton url={url_share}>
        <RedditIcon size={28} className="rounded" />
      </RedditShareButton>
      <TelegramShareButton url={url_share}>
        <TelegramIcon size={28} className="rounded" />
      </TelegramShareButton>
    </article>
  )
}

export default memo(MovieButtonShares)
