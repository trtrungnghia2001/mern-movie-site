export type OphimCardLayoutType = 'horizontal' | 'vertical'

export type OphimListMoveType =
  | `phim-moi`
  | `phim-le`
  | `phim-bo`
  | `hoat-hinh`
  | `tv-shows`
  | `phim-chieu-rap`

export interface IOphimCategory {
  _id: string
  slug: string
  name: string
}

export interface IOphimCountry {
  _id: string
  slug: string
  name: string
}

export interface IMovie {
  tmdb: {
    type: string
    id: string
    season: number
    vote_average: number
    vote_count: number
  }
  imdb: {
    id: string
  }
  created: {
    time: string
  }
  modified: {
    time: string
  }
  _id: string
  name: string
  origin_name: string
  content: string
  type: string
  status: string
  thumb_url: string
  is_copyright: boolean
  trailer_url: string
  time: string
  episode_current: string
  episode_total: string
  quality: string
  lang: string
  notify: string
  showtimes: string
  slug: string
  year: number
  view: number
  actor: string[]
  director: string[]
  category: {
    id: string
    name: string
    slug: string
  }[]
  country: {
    id: string
    name: string
    slug: string
  }[]
  chieurap: boolean
  poster_url: string
  sub_docquyen: boolean
  episodes: {
    server_name: string
    server_data: {
      name: string
      slug: string
      filename: string
      link_embed: string
      link_m3u8: string
    }[]
  }[]
}

export interface IMovieDetail {
  tmdb: {
    type: string
    id: string
    season: number
    vote_average: number
    vote_count: number
  }
  imdb: {
    id: string
  }
  created: {
    time: string
  }
  modified: {
    time: string
  }
  _id: string
  name: string
  origin_name: string
  content: string
  type: string
  status: string
  thumb_url: string
  is_copyright: boolean
  trailer_url: string
  time: string
  episode_current: string
  episode_total: string
  quality: string
  lang: string
  notify: string
  showtimes: string
  slug: string
  year: number
  view: number
  actor: string[]
  director: string[]
  category: {
    id: string
    name: string
    slug: string
  }[]
  country: {
    id: string
    name: string
    slug: string
  }[]
  chieurap: boolean
  poster_url: string
  sub_docquyen: boolean
  episodes: {
    server_name: string
    server_data: {
      name: string
      slug: string
      filename: string
      link_embed: string
      link_m3u8: string
    }[]
  }[]
}
