import { apiRequest } from './client'

type UploadRead = {
  url: string
}

export async function uploadImage(token: string, file: File): Promise<string> {
  const body = new FormData()
  body.append('file', file)
  const data = await apiRequest<UploadRead>(
    '/api/v1/uploads',
    {
      method: 'POST',
      body,
    },
    token,
  )
  return data.url
}
