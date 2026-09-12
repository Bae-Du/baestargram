import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { createPost } from '../api/posts'
import { uploadImage } from '../api/uploads'
import './CreatePage.css'

export function CreatePage() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [caption, setCaption] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.files?.[0]
    if (!next) return
    setFile(next)
    setPreview(URL.createObjectURL(next))
    setError('')
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!token || !file || submitting) return
    setError('')
    setSubmitting(true)
    try {
      const mediaUrl = await uploadImage(token, file)
      await createPost(token, { caption: caption.trim(), mediaUrls: [mediaUrl] })
      navigate('/', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : '게시물을 올리지 못했어요.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="create-page">
      <form className="create-page__card" onSubmit={onSubmit}>
        <h1>새 게시물</h1>
        <label className="create-page__drop">
          {preview ? (
            <img src={preview} alt="미리보기" />
          ) : (
            <span>사진을 선택하세요</span>
          )}
          <input type="file" accept="image/*" onChange={onFileChange} />
        </label>
        <textarea
          className="create-page__caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="문구 입력..."
          maxLength={2200}
          rows={4}
        />
        <button type="submit" disabled={!file || !token || submitting}>
          {submitting ? '공유 중...' : '공유하기'}
        </button>
        {error ? <p className="create-page__error">{error}</p> : null}
      </form>
    </div>
  )
}
