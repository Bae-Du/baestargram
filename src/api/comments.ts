import type { PostComment } from '../types'
import { mapApiUser } from './auth'
import { apiRequest } from './client'

type ApiComment = {
  id: number
  post_id: number
  content: string
  parent_id: number | null
  created_at: string
  author: {
    id: number
    username: string
    display_name?: string | null
    bio?: string | null
    profile_image_url?: string | null
  }
}

function mapApiComment(comment: ApiComment): PostComment {
  return {
    id: String(comment.id),
    postId: String(comment.post_id),
    parentId: comment.parent_id == null ? null : String(comment.parent_id),
    content: comment.content,
    createdAt: comment.created_at,
    user: mapApiUser(comment.author),
  }
}

export async function listComments(postId: string): Promise<PostComment[]> {
  const data = await apiRequest<ApiComment[]>(`/api/v1/posts/${postId}/comments`)
  return data.map(mapApiComment)
}

export async function createComment(
  token: string,
  postId: string,
  content: string,
  parentId?: string | null,
): Promise<PostComment> {
  const data = await apiRequest<ApiComment>(
    `/api/v1/posts/${postId}/comments`,
    {
      method: 'POST',
      body: JSON.stringify({
        content,
        parent_id: parentId ? Number(parentId) : null,
      }),
    },
    token,
  )
  return mapApiComment(data)
}
