import type { Post } from '../types'
import { mapApiUser } from './auth'
import { apiRequest, isApiConfigured, resolveMediaUrl } from './client'

type ApiPost = {
  id: number
  caption: string | null
  created_at: string
  author: {
    id: number
    username: string
    display_name?: string | null
    bio?: string | null
    profile_image_url?: string | null
  }
  media: { id: number; url: string; media_type: string; sort_order: number }[]
  like_count: number
  comment_count: number
  liked_by_me: boolean
}

function formatTime(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  const diffMs = Date.now() - date.getTime()
  const minutes = Math.floor(diffMs / 60000)
  if (minutes < 1) return '방금 전'
  if (minutes < 60) return `${minutes}분 전`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}시간 전`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}일 전`
  return date.toLocaleDateString('ko-KR')
}

export function mapApiPost(post: ApiPost): Post {
  const firstMedia = [...post.media].sort((a, b) => a.sort_order - b.sort_order)[0]
  return {
    id: String(post.id),
    user: mapApiUser(post.author),
    imageUrl: resolveMediaUrl(firstMedia?.url ?? ''),
    caption: post.caption ?? '',
    likes: post.like_count,
    commentsCount: post.comment_count,
    createdAt: formatTime(post.created_at),
    liked: post.liked_by_me,
  }
}

export async function listFeed(token: string): Promise<Post[]> {
  if (!isApiConfigured()) return []
  const data = await apiRequest<ApiPost[]>('/api/v1/feed', { method: 'GET' }, token)
  return data.map(mapApiPost)
}

export async function listPosts(token?: string | null, username?: string): Promise<Post[]> {
  if (!isApiConfigured()) return []
  const query = username ? `?username=${encodeURIComponent(username)}` : ''
  const data = await apiRequest<ApiPost[]>(`/api/v1/posts${query}`, { method: 'GET' }, token)
  return data.map(mapApiPost)
}

export async function createPost(
  token: string,
  payload: { caption: string; mediaUrls: string[] },
): Promise<Post> {
  const data = await apiRequest<ApiPost>(
    '/api/v1/posts',
    {
      method: 'POST',
      body: JSON.stringify({
        caption: payload.caption || null,
        media_urls: payload.mediaUrls,
      }),
    },
    token,
  )
  return mapApiPost(data)
}
