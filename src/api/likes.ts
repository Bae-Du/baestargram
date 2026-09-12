import { apiRequest } from './client'

export type LikeStatus = {
  liked: boolean
  like_count: number
}

export async function likePost(token: string, postId: string): Promise<LikeStatus> {
  return apiRequest<LikeStatus>(`/api/v1/posts/${postId}/like`, { method: 'POST' }, token)
}

export async function unlikePost(token: string, postId: string): Promise<LikeStatus> {
  return apiRequest<LikeStatus>(`/api/v1/posts/${postId}/like`, { method: 'DELETE' }, token)
}
