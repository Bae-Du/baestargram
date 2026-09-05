import { useState } from 'react'
import type { Post } from '../../types'
import { Avatar } from '../common/Avatar'
import {
  BookmarkIcon,
  CommentIcon,
  HeartIcon,
  MoreIcon,
  ShareIcon,
} from '../icons/NavIcons'
import './PostCard.css'

type PostCardProps = {
  post: Post
}

function formatCount(n: number) {
  return n.toLocaleString('ko-KR')
}

export function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(Boolean(post.liked))
  const [saved, setSaved] = useState(Boolean(post.saved))
  const [likes, setLikes] = useState(post.likes)

  const toggleLike = () => {
    setLiked((prev) => {
      setLikes((count) => (prev ? count - 1 : count + 1))
      return !prev
    })
  }

  return (
    <article className="post">
      <header className="post__header">
        <div className="post__user">
          <Avatar user={post.user} size="sm" ring />
          <div>
            <p className="post__username">{post.user.username}</p>
            <p className="post__time">{post.createdAt}</p>
          </div>
        </div>
        <button type="button" className="post__more" aria-label="더보기">
          <MoreIcon className="post__action-icon" />
        </button>
      </header>

      <div className="post__media">
        <img src={post.imageUrl} alt="" loading="lazy" />
      </div>

      <div className="post__actions">
        <div className="post__actions-left">
          <button
            type="button"
            className={`post__action${liked ? ' post__action--liked' : ''}`}
            aria-label={liked ? '좋아요 취소' : '좋아요'}
            onClick={toggleLike}
          >
            <HeartIcon className="post__action-icon" filled={liked} />
          </button>
          <button type="button" className="post__action" aria-label="댓글">
            <CommentIcon className="post__action-icon" />
          </button>
          <button type="button" className="post__action" aria-label="공유">
            <ShareIcon className="post__action-icon" />
          </button>
        </div>
        <button
          type="button"
          className="post__action"
          aria-label={saved ? '저장 취소' : '저장'}
          onClick={() => setSaved((v) => !v)}
        >
          <BookmarkIcon className="post__action-icon" filled={saved} />
        </button>
      </div>

      <div className="post__body">
        <p className="post__likes">좋아요 {formatCount(likes)}개</p>
        <p className="post__caption">
          <span className="post__username">{post.user.username}</span> {post.caption}
        </p>
        <button type="button" className="post__comments-link">
          댓글 {formatCount(post.commentsCount)}개 모두 보기
        </button>
      </div>
    </article>
  )
}
