import type { Story } from '../../types'
import { Avatar } from '../common/Avatar'
import './Stories.css'

type StoriesProps = {
  items: Story[]
}

export function Stories({ items }: StoriesProps) {
  return (
    <section className="stories" aria-label="스토리">
      <ul className="stories__list">
        {items.map((story) => (
          <li key={story.id} className="stories__item">
            <button type="button" className="stories__btn">
              <Avatar
                user={story.user}
                size="lg"
                ring
                seen={!story.hasUnseen}
              />
              <span className="stories__name">
                {story.id === 's-me' || story.user.id === 'me'
                  ? '내 스토리'
                  : story.user.username}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
