import { useEffect, useState, type FormEvent } from 'react'
import type { Post, PostComment, User } from '../../types'
import { createComment, listComments } from '../../api/comments'
import { likePost, unlikePost } from '../../api/likes'
import { deletePost, updatePost } from '../../api/posts'
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
  token: string | null
  currentUser?: User | null
  onDeleted?: (postId: string) => void
}

function formatCount(n: number) {
  return n.toLocaleString('ko-KR')
}

export function PostCard({ post, token, currentUser, onDeleted }: PostCardProps) {
  const [liked, setLiked] = useState(Boolean(post.liked))
  const [saved, setSaved] = useState(Boolean(post.saved))
  const [likes, setLikes] = useState(post.likes)
  const [caption, setCaption] = useState(post.caption)
  const [menuOpen, setMenuOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editDraft, setEditDraft] = useState(post.caption)
  const [menuError, setMenuError] = useState('')
  const [menuBusy, setMenuBusy] = useState(false)
  const isOwner = Boolean(
    currentUser &&
      (currentUser.id === post.user.id || currentUser.username === post.user.username),
  )
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [comments, setComments] = useState<PostComment[]>([])
  const [commentsCount, setCommentsCount] = useState(post.commentsCount)
  const [draft, setDraft] = useState('')
  const [replyTo, setReplyTo] = useState<PostComment | null>(null)
  const [openReplies, setOpenReplies] = useState<Record<string, boolean>>({})
  const [loadingComments, setLoadingComments] = useState(false)
  const [commentError, setCommentError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [likeBusy, setLikeBusy] = useState(false)

  useEffect(() => {
    if (!commentsOpen) return
    let cancelled = false
    setLoadingComments(true)
    setCommentError('')
    listComments(post.id)
      .then((items) => {
        if (!cancelled) setComments(items)
      })
      .catch((err) => {
        if (!cancelled) {
          setCommentError(err instanceof Error ? err.message : '댓글을 불러오지 못했어요.')
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingComments(false)
      })
    return () => {
      cancelled = true
    }
  }, [commentsOpen, post.id])

  const roots = comments.filter((comment) => !comment.parentId)
  const repliesByParent = new Map<string, PostComment[]>()
  for (const comment of comments) {
    if (!comment.parentId) continue
    const list = repliesByParent.get(comment.parentId) ?? []
    list.push(comment)
    repliesByParent.set(comment.parentId, list)
  }

  const toggleLike = async () => {
    if (!token || likeBusy) return
    const nextLiked = !liked
    setLiked(nextLiked)
    setLikes((count) => count + (nextLiked ? 1 : -1))
    setLikeBusy(true)
    try {
      const result = nextLiked
        ? await likePost(token, post.id)
        : await unlikePost(token, post.id)
      setLiked(result.liked)
      setLikes(result.like_count)
    } catch {
      setLiked(!nextLiked)
      setLikes((count) => count + (nextLiked ? -1 : 1))
    } finally {
      setLikeBusy(false)
    }
  }

  const onSubmitComment = async (event: FormEvent) => {
    event.preventDefault()
    const content = draft.trim()
    if (!token || !content || submitting) return
    setSubmitting(true)
    setCommentError('')
    try {
      const parentId = replyTo?.parentId ?? replyTo?.id ?? null
      const created = await createComment(token, post.id, content, parentId)
      setComments((prev) => [...prev, created])
      setCommentsCount((count) => count + 1)
      setDraft('')
      setReplyTo(null)
      setCommentsOpen(true)
      if (created.parentId) {
        setOpenReplies((prev) => ({ ...prev, [created.parentId!]: true }))
      }
    } catch (err) {
      setCommentError(err instanceof Error ? err.message : '댓글을 달지 못했어요.')
    } finally {
      setSubmitting(false)
    }
  }

  const closeMenu = () => {
    setMenuOpen(false)
    setConfirmDelete(false)
    setMenuError('')
  }

  const copyLink = async () => {
    const url = `${window.location.origin}/?p=${post.id}`
    try {
      await navigator.clipboard.writeText(url)
      closeMenu()
    } catch {
      setMenuError('링크를 복사하지 못했어요.')
    }
  }

  const onSaveCaption = async () => {
    if (!token || menuBusy) return
    setMenuBusy(true)
    setMenuError('')
    try {
      const updated = await updatePost(token, post.id, editDraft.trim())
      setCaption(updated.caption)
      setEditing(false)
    } catch (err) {
      setMenuError(err instanceof Error ? err.message : '수정하지 못했어요.')
    } finally {
      setMenuBusy(false)
    }
  }

  const onDeletePost = async () => {
    if (!token || menuBusy) return
    setMenuBusy(true)
    setMenuError('')
    try {
      await deletePost(token, post.id)
      closeMenu()
      onDeleted?.(post.id)
    } catch (err) {
      setMenuError(err instanceof Error ? err.message : '삭제하지 못했어요.')
    } finally {
      setMenuBusy(false)
    }
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
        <button
          type="button"
          className="post__more"
          aria-label="더보기"
          onClick={() => {
            setMenuOpen(true)
            setConfirmDelete(false)
            setMenuError('')
          }}
        >
          <MoreIcon className="post__action-icon" />
        </button>
      </header>

      <div className="post__media">
        <img
          src={post.imageUrl}
          alt=""
          loading="lazy"
          onDoubleClick={() => {
            if (!liked) void toggleLike()
          }}
        />
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
          <button
            type="button"
            className="post__action"
            aria-label="댓글"
            onClick={() => setCommentsOpen((open) => !open)}
          >
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
        {editing ? (
          <div className="post__edit">
            <textarea
              value={editDraft}
              onChange={(e) => setEditDraft(e.target.value)}
              maxLength={2200}
              rows={3}
            />
            <div className="post__edit-actions">
              <button type="button" onClick={() => setEditing(false)} disabled={menuBusy}>
                취소
              </button>
              <button type="button" onClick={() => void onSaveCaption()} disabled={menuBusy}>
                {menuBusy ? '저장 중...' : '완료'}
              </button>
            </div>
          </div>
        ) : caption ? (
          <p className="post__caption">
            <span className="post__username">{post.user.username}</span> {caption}
          </p>
        ) : null}
        <button
          type="button"
          className="post__comments-link"
          onClick={() => setCommentsOpen((open) => !open)}
        >
          {commentsCount > 0
            ? `댓글 ${formatCount(commentsCount)}개 모두 보기`
            : '댓글 달기'}
        </button>

        {commentsOpen ? (
          <div className="post__comments">
            {loadingComments ? <p className="post__comment-status">댓글을 불러오는 중...</p> : null}
            {roots.map((comment) => {
              const replies = repliesByParent.get(comment.id) ?? []
              const repliesVisible = Boolean(openReplies[comment.id])
              return (
                <div key={comment.id} className="post__thread">
                  <div className="post__comment-row">
                    <p className="post__comment">
                      <span className="post__username">{comment.user.username}</span> {comment.content}
                    </p>
                    <button
                      type="button"
                      className="post__reply-btn"
                      onClick={() => {
                        setReplyTo(comment)
                        setCommentsOpen(true)
                      }}
                    >
                      답글 달기
                    </button>
                  </div>
                  {replies.length > 0 ? (
                    <button
                      type="button"
                      className="post__replies-toggle"
                      onClick={() =>
                        setOpenReplies((prev) => ({ ...prev, [comment.id]: !prev[comment.id] }))
                      }
                    >
                      {repliesVisible
                        ? '답글 숨기기'
                        : `답글 ${formatCount(replies.length)}개 보기`}
                    </button>
                  ) : null}
                  {repliesVisible
                    ? replies.map((reply) => (
                        <div key={reply.id} className="post__comment-row post__comment-row--reply">
                          <p className="post__comment">
                            <span className="post__username">{reply.user.username}</span>{' '}
                            {reply.content}
                          </p>
                          <button
                            type="button"
                            className="post__reply-btn"
                            onClick={() => {
                              setReplyTo(reply)
                              setCommentsOpen(true)
                            }}
                          >
                            답글 달기
                          </button>
                        </div>
                      ))
                    : null}
                </div>
              )
            })}
            {!loadingComments && comments.length === 0 ? (
              <p className="post__comment-status">아직 댓글이 없어요.</p>
            ) : null}
          </div>
        ) : null}
      </div>

      {replyTo ? (
        <div className="post__replying">
          <span>{replyTo.user.username}님에게 답글 남기는 중</span>
          <button type="button" onClick={() => setReplyTo(null)}>
            취소
          </button>
        </div>
      ) : null}

      <form className="post__composer" onSubmit={onSubmitComment}>
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={replyTo ? `${replyTo.user.username}님에게 답글 달기...` : '댓글 달기...'}
          maxLength={2200}
          disabled={!token || submitting}
        />
        <button type="submit" disabled={!token || !draft.trim() || submitting}>
          게시
        </button>
      </form>
      {commentError ? <p className="post__comment-error">{commentError}</p> : null}

      {menuOpen ? (
        <div className="post-sheet" onClick={closeMenu} role="presentation">
          <div
            className="post-sheet__card"
            role="dialog"
            aria-label="게시물 옵션"
            onClick={(event) => event.stopPropagation()}
          >
            {confirmDelete ? (
              <>
                <p className="post-sheet__lead">이 게시물을 삭제할까요?</p>
                <button
                  type="button"
                  className="post-sheet__item post-sheet__item--danger"
                  onClick={() => void onDeletePost()}
                  disabled={menuBusy}
                >
                  {menuBusy ? '삭제 중...' : '삭제'}
                </button>
                <button type="button" className="post-sheet__item" onClick={() => setConfirmDelete(false)}>
                  취소
                </button>
              </>
            ) : (
              <>
                {isOwner ? (
                  <>
                    <button
                      type="button"
                      className="post-sheet__item"
                      onClick={() => {
                        setEditDraft(caption)
                        setEditing(true)
                        closeMenu()
                      }}
                    >
                      수정
                    </button>
                    <button
                      type="button"
                      className="post-sheet__item post-sheet__item--danger"
                      onClick={() => setConfirmDelete(true)}
                    >
                      삭제
                    </button>
                  </>
                ) : null}
                <button type="button" className="post-sheet__item" onClick={() => void copyLink()}>
                  링크 복사
                </button>
                <button type="button" className="post-sheet__item" onClick={closeMenu}>
                  취소
                </button>
              </>
            )}
            {menuError ? <p className="post-sheet__error">{menuError}</p> : null}
          </div>
        </div>
      ) : null}
    </article>
  )
}
