export type User = {
  id: string
  username: string
  displayName: string
  avatarUrl: string
  bio?: string
  email?: string
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

export type PostComment = {
  id: string
  postId: string
  parentId: string | null
  content: string
  createdAt: string
  user: User
}

export type ExploreItem = {
  id: string
  imageUrl: string
  likes: number
  commentsCount: number
}

export type AuthTokenResponse = {
  access_token: string
  token_type: 'bearer'
  user: User
}

export type LoginPayload = {
  username: string
  password: string
}

export type SignupPayload = {
  username: string
  email: string
  password: string
  display_name: string
}
