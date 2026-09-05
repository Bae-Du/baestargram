import { posts, stories } from '../data/mock'
import { PostCard } from '../components/feed/PostCard'
import { Stories } from '../components/feed/Stories'
import './HomePage.css'

export function HomePage() {
  return (
    <div className="home-page">
      <header className="home-page__mobile-header">
        <h1 className="home-page__logo">baestargram</h1>
      </header>
      <div className="home-page__feed">
        <Stories items={stories} />
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}
