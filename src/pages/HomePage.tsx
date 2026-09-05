import { posts, stories } from '../data/mock'
import { useAuth } from '../auth/AuthContext'
import { PostCard } from '../components/feed/PostCard'
import { Stories } from '../components/feed/Stories'
import './HomePage.css'

export function HomePage() {
  const { user } = useAuth()
  const feedStories = user
    ? [{ id: 's-me', user, hasUnseen: false }, ...stories.filter((story) => story.user.id !== 'me')]
    : stories

  return (
    <div className="home-page">
      <header className="home-page__mobile-header">
        <h1 className="home-page__logo">baestargram</h1>
      </header>
      <div className="home-page__feed">
        <Stories items={feedStories} />
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}
