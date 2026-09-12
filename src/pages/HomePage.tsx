import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { posts as mockPosts, stories } from '../data/mock'
import { listFeed } from '../api/posts'
import { isApiConfigured } from '../api/client'
import { useAuth } from '../auth/AuthContext'
import { PostCard } from '../components/feed/PostCard'
import { Stories } from '../components/feed/Stories'
import type { Post } from '../types'
import './HomePage.css'

export function HomePage() {
  const { user, token } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(isApiConfigured())
  const [error, setError] = useState('')
  const feedStories = user
    ? [{ id: 's-me', user, hasUnseen: false }, ...stories.filter((story) => story.user.id !== 'me')]
    : stories

  useEffect(() => {
    if (!isApiConfigured() || !token) {
      setPosts(mockPosts)
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    listFeed(token)
      .then((items) => {
        if (!cancelled) setPosts(items)
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : '피드를 불러오지 못했어요.')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [token])

  return (
    <div className="home-page">
      <header className="home-page__mobile-header">
        <h1 className="home-page__logo">baestargram</h1>
      </header>
      <div className="home-page__feed">
        <Stories items={feedStories} />
        {loading ? <p className="home-page__status">피드를 불러오는 중...</p> : null}
        {error ? <p className="home-page__status home-page__status--error">{error}</p> : null}
        {!loading && !error && posts.length === 0 ? (
          <p className="home-page__status">
            아직 게시물이 없어요. <Link to="/create">첫 게시물 올리기</Link>
          </p>
        ) : null}
        {posts.map((post) => (
          <PostCard key={post.id} post={post} token={token} />
        ))}
      </div>
    </div>
  )
}
