export function yearsData() {
  const year = new Date().getFullYear()
  const years = []
  for (let i = year; i >= 1975; i--) {
    years.push(i)
  }
  return years
}

export const ophimOptionLists = [
  {
    name: `Phim mới`,
    slug: `phim-moi`,
  },
  {
    name: `Phim lẻ`,
    slug: `phim-le`,
  },
  {
    name: `Phim bộ`,
    slug: `phim-bo`,
  },
  {
    name: `Phim chiếu rạp`,
    slug: `phim-chieu-rap`,
  },
  {
    name: `Hoạt hình`,
    slug: `hoat-hinh`,
  },
  {
    name: `TV Shows`,
    slug: `tv-shows`,
  },
]
export const ophimOptionSorts = [
  {
    name: `Ngày cập nhật`,
    slug: `modified.time`,
  },
  {
    name: `Ngày phát hành`,
    slug: `year`,
  },
  {
    name: `Lượt xem`,
    slug: `view`,
  },
]
export const ophimHeaderLinks = [
  {
    name: `Phim mới`,
    slug: `phim-moi`,
  },
  {
    name: `Phim lẻ`,
    slug: `phim-le`,
  },
  {
    name: `Phim bộ`,
    slug: `phim-bo`,
  },
]
