const BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? ''

export function isApiConfigured() {
  return BASE_URL.length > 0
}

export function resolveMediaUrl(url: string) {
  if (!url) return url
  if (/^https?:\/\//i.test(url)) return url
  return `${BASE_URL}${url.startsWith('/') ? url : `/${url}`}`
}

type ApiErrorBody = {
  detail?: string | { msg?: string }[]
}

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function readErrorMessage(body: ApiErrorBody, fallback: string) {
  if (typeof body.detail === 'string') return body.detail
  if (Array.isArray(body.detail) && body.detail[0]?.msg) return body.detail[0].msg
  return fallback
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
  token?: string | null,
): Promise<T> {
  const headers = new Headers(init.headers)
  const isFormData = typeof FormData !== 'undefined' && init.body instanceof FormData
  if (init.body && !isFormData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers,
  })

  if (!response.ok) {
    let message = '요청을 처리하지 못했어요.'
    try {
      const body = (await response.json()) as ApiErrorBody
      message = readErrorMessage(body, message)
    } catch {
      // FastAPI 에러 본문이 없을 수 있음
    }
    throw new ApiError(message, response.status)
  }

  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

export function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` }
}
