import { exploreItems } from '../data/mock'
import './ExplorePage.css'

export function ExplorePage() {
  return (
    <div className="explore-page">
      <header className="explore-page__header">
        <label className="explore-page__search">
          <span className="visually-hidden">검색</span>
          <input type="search" placeholder="검색" />
        </label>
      </header>
      <div className="explore-page__grid">
        {exploreItems.map((item) => (
          <button key={item.id} type="button" className="explore-page__cell">
            <img src={item.imageUrl} alt="" loading="lazy" />
            <span className="explore-page__meta">
              ♥ {item.likes.toLocaleString('ko-KR')} · 💬 {item.commentsCount}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
