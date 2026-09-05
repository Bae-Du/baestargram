export type User = {
  id: string
  username: string
  displayName: string
  avatarUrl: string
  bio?: string
  postsCount: number
  followersCount: number
  followingCount: number
}

export type Story = {
  id: string
  user: User
  hasUnseen: boolean
}

export type Post = {
  id: string
  user: User
  imageUrl: string
  caption: string
  likes: number
  commentsCount: number
  createdAt: string
  liked?: boolean
  saved?: boolean
}

export type ExploreItem = {
  id: string
  imageUrl: string
  likes: number
  commentsCount: number
}
