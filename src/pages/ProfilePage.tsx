import { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { listPosts } from '../api/posts'
import { isApiConfigured } from '../api/client'
import { Avatar } from '../components/common/Avatar'
import { profilePosts as mockProfilePosts } from '../data/mock'
import type { Post } from '../types'
import './ProfilePage.css'

function formatCount(n: number) {
  return n.toLocaleString('ko-KR')
}

export function ProfilePage() {
  const { user, token, logout } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    if (!user) return
    if (!isApiConfigured()) {
      setPosts(
        mockProfilePosts.map((item) => ({
          id: item.id,
          user,
          imageUrl: item.imageUrl,
          caption: '',
          likes: item.likes,
          commentsCount: item.commentsCount,
          createdAt: '',
        })),
      )
      return
    }
    listPosts(token, user.username)
      .then(setPosts)
      .catch(() => setPosts([]))
  }, [token, user])

  if (!user) return null

  return (
    <div className="profile-page">
      <header className="profile-page__header">
        <Avatar user={user} size="xl" />
        <div className="profile-page__info">
          <div className="profile-page__top">
            <h1 className="profile-page__username">{user.username}</h1>
            <button type="button" className="profile-page__edit">
              프로필 편집
            </button>
            <button type="button" className="profile-page__edit" onClick={logout}>
              로그아웃
            </button>
          </div>
          <ul className="profile-page__stats">
            <li>
              <strong>{formatCount(posts.length)}</strong> 게시물
            </li>
            <li>
              <strong>{formatCount(user.followersCount)}</strong> 팔로워
            </li>
            <li>
              <strong>{formatCount(user.followingCount)}</strong> 팔로우
            </li>
          </ul>
          <p className="profile-page__name">{user.displayName}</p>
          <p className="profile-page__bio">{user.bio}</p>
        </div>
      </header>

      <div className="profile-page__tabs" role="tablist">
        <button type="button" className="profile-page__tab profile-page__tab--active" role="tab">
          게시물
        </button>
        <button type="button" className="profile-page__tab" role="tab">
          저장됨
        </button>
        <button type="button" className="profile-page__tab" role="tab">
          태그됨
        </button>
      </div>

      <div className="profile-page__grid">
        {posts.map((post) => (
          <button key={post.id} type="button" className="profile-page__cell">
            <img src={post.imageUrl} alt="" loading="lazy" />
          </button>
        ))}
      </div>
    </div>
  )
}
