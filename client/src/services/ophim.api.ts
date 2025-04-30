import { OphimListMoveType } from '@/types/ophim.type'
import axios from 'axios'

const OPHIM_URL = `https://ophim1.com/v1/api/`

export async function ophimGetCategoriesApi(slug?: string, query?: string) {
  const url = OPHIM_URL + `the-loai/` + (slug || '') + `?` + (query || '')
  const response = await axios.get(url)
  return await response.data
}
export async function ophimGetCountriesApi(slug?: string, query?: string) {
  const url = OPHIM_URL + `quoc-gia/` + (slug || '') + `?` + (query || '')
  const response = await axios.get(url)
  return await response.data
}
export async function ophimGetListMovieApi(
  type: OphimListMoveType,
  query?: string,
) {
  const url = OPHIM_URL + `danh-sach/` + type + '?' + (query || '')
  const response = await axios.get(url)
  return await response.data
}
export async function ophimGetSearchMovieApi(query?: string) {
  const url = OPHIM_URL + `tim-kiem?` + (query || '')
  const response = await axios.get(url)
  return await response.data
}
export async function ophimGetMovieDetailApi(slug: string) {
  const url = OPHIM_URL + `phim/` + slug
  const response = await axios.get(url)
  return await response.data
}

export function ophimGetImage(thumb_url: string) {
  return `https://img.ophim.live/uploads/movies/` + thumb_url
}
