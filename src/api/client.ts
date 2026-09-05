const BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? ''

export function isApiConfigured() {
  return BASE_URL.length > 0
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

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
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
