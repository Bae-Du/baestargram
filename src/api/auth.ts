import type { AuthTokenResponse, LoginPayload, SignupPayload, User } from '../types'
import { ApiError, apiRequest, isApiConfigured } from './client'

const USERS_KEY = 'baestargram_mock_users'

type StoredUser = User & { password: string }

type ApiUser = {
  id: number | string
  username: string
  email?: string | null
  display_name?: string | null
  bio?: string | null
  profile_image_url?: string | null
}

type ApiAuthResponse = {
  access_token: string
  token_type: string
  user: ApiUser
}

function delay(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function placeholderAvatar(username: string) {
  return `https://i.pravatar.cc/150?u=${encodeURIComponent(username)}`
}

export function mapApiUser(user: ApiUser): User {
  const username = user.username
  return {
    id: String(user.id),
    username,
    displayName: user.display_name?.trim() || username,
    avatarUrl: user.profile_image_url || placeholderAvatar(username),
    bio: user.bio ?? undefined,
    email: user.email ?? undefined,
    postsCount: 0,
    followersCount: 0,
    followingCount: 0,
  }
}

function mapAuthResponse(data: ApiAuthResponse): AuthTokenResponse {
  return {
    access_token: data.access_token,
    token_type: 'bearer',
    user: mapApiUser(data.user),
  }
}

function toUser(username: string, displayName: string, email?: string): User {
  return {
    id: `user-${username}`,
    username,
    displayName,
    email,
    avatarUrl: placeholderAvatar(username),
    bio: 'baestargram',
    postsCount: 0,
    followersCount: 0,
    followingCount: 0,
  }
}

function readStoredUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    return raw ? (JSON.parse(raw) as StoredUser[]) : []
  } catch {
    return []
  }
}

function writeStoredUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function mockToken(username: string) {
  return `mock.${encodeURIComponent(username)}.${Date.now()}`
}

function translateAuthError(err: unknown, fallback: string): never {
  if (err instanceof ApiError) {
    if (err.status === 409) {
      throw new ApiError('이미 사용 중인 계정이에요.', err.status)
    }
    if (err.status === 401) {
      throw new ApiError('아이디 또는 비밀번호가 올바르지 않아요.', err.status)
    }
    if (err.status === 422) {
      const msg = err.message.toLowerCase()
      if (msg.includes('password')) {
        throw new ApiError('비밀번호는 8자 이상이어야 해요.', err.status)
      }
      if (msg.includes('username')) {
        throw new ApiError('사용자 이름은 3–30자여야 해요.', err.status)
      }
      if (msg.includes('email')) {
        throw new ApiError('올바른 이메일을 입력해 주세요.', err.status)
      }
      throw new ApiError('입력값을 다시 확인해 주세요.', err.status)
    }
    throw err
  }
  throw err instanceof Error ? err : new Error(fallback)
}

async function mockLogin({ username, password }: LoginPayload): Promise<AuthTokenResponse> {
  await delay()
  const trimmed = username.trim()
  if (trimmed.length < 2) throw new Error('사용자 이름을 입력해 주세요.')
  if (password.length < 6) throw new Error('비밀번호는 6자 이상이어야 해요.')

  const saved = readStoredUsers().find(
    (user) => user.username === trimmed || user.email === trimmed,
  )
  if (saved && saved.password !== password) {
    throw new Error('비밀번호가 올바르지 않아요.')
  }

  const user = saved
    ? {
        id: saved.id,
        username: saved.username,
        displayName: saved.displayName,
        avatarUrl: saved.avatarUrl,
        bio: saved.bio,
        email: saved.email,
        postsCount: saved.postsCount,
        followersCount: saved.followersCount,
        followingCount: saved.followingCount,
      }
    : toUser(trimmed, trimmed)

  return {
    access_token: mockToken(user.username),
    token_type: 'bearer',
    user,
  }
}

async function mockSignup(payload: SignupPayload): Promise<AuthTokenResponse> {
  await delay()
  const username = payload.username.trim()
  const email = payload.email.trim()
  const displayName = payload.display_name.trim() || username

  if (!email.includes('@')) throw new Error('올바른 이메일을 입력해 주세요.')
  if (username.length < 3 || username.length > 30) {
    throw new Error('사용자 이름은 3–30자여야 해요.')
  }
  if (payload.password.length < 8) throw new Error('비밀번호는 8자 이상이어야 해요.')

  const users = readStoredUsers()
  if (users.some((user) => user.username === username || user.email === email)) {
    throw new Error('이미 사용 중인 계정이에요.')
  }

  const user = toUser(username, displayName, email)
  writeStoredUsers([...users, { ...user, password: payload.password }])

  return {
    access_token: mockToken(username),
    token_type: 'bearer',
    user,
  }
}

export async function login(payload: LoginPayload): Promise<AuthTokenResponse> {
  if (!isApiConfigured()) return mockLogin(payload)
  try {
    const data = await apiRequest<ApiAuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    return mapAuthResponse(data)
  } catch (err) {
    translateAuthError(err, '로그인에 실패했어요.')
  }
}

export async function signup(payload: SignupPayload): Promise<AuthTokenResponse> {
  if (!isApiConfigured()) return mockSignup(payload)
  try {
    const data = await apiRequest<ApiAuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    return mapAuthResponse(data)
  } catch (err) {
    translateAuthError(err, '가입에 실패했어요.')
  }
}
