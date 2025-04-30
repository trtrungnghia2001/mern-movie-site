export interface IComicMovieInfo {
  isFavorite: boolean
  isHistory: boolean
  isLike: boolean

  chapter_id: string

  count_favorites: number
  count_likes: number
  count_views: number
}
