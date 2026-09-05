import type { AuthTokenResponse, LoginPayload, SignupPayload, User } from '../types'
import { apiRequest, isApiConfigured } from './client'

const USERS_KEY = 'baestargram_mock_users'

type StoredUser = User & { password: string }

function delay(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function toUser(username: string, displayName: string, email?: string): User {
  return {
    id: `user-${username}`,
    username,
    displayName,
    email,
    avatarUrl: `https://i.pravatar.cc/150?u=${encodeURIComponent(username)}`,
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
  if (username.length < 2) throw new Error('사용자 이름은 2자 이상이어야 해요.')
  if (payload.password.length < 6) throw new Error('비밀번호는 6자 이상이어야 해요.')

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
  return apiRequest<AuthTokenResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function signup(payload: SignupPayload): Promise<AuthTokenResponse> {
  if (!isApiConfigured()) return mockSignup(payload)
  return apiRequest<AuthTokenResponse>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
