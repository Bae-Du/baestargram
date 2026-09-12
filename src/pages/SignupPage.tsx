import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/auth/AuthLayout'
import { useAuth } from '../auth/AuthContext'

export function SignupPage() {
  const { signup } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const trimmedEmail = email.trim()
  const trimmedUsername = username.trim()
  const trimmedDisplayName = displayName.trim()
  const canSubmit =
    trimmedEmail.length > 0 &&
    trimmedUsername.length >= 3 &&
    trimmedUsername.length <= 30 &&
    password.length >= 8 &&
    !submitting

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (submitting) return

    if (trimmedUsername.length < 3 || trimmedUsername.length > 30) {
      setError('사용자 이름은 3–30자여야 해요.')
      return
    }
    if (password.length < 8) {
      setError('비밀번호는 8자 이상이어야 해요.')
      return
    }
    if (!trimmedEmail.includes('@')) {
      setError('올바른 이메일을 입력해 주세요.')
      return
    }

    setError('')
    setSubmitting(true)
    try {
      await signup({
        email: trimmedEmail,
        username: trimmedUsername,
        password,
        display_name: trimmedDisplayName || trimmedUsername,
      })
      navigate('/', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : '가입에 실패했어요.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout switchText="계정이 있으신가요?" switchLabel="로그인" switchTo="/login">
      <h1 className="auth-logo">baestargram</h1>
      <p className="auth-lead">친구들의 사진과 동영상을 보려면 가입하세요.</p>
      <form className="auth-form" onSubmit={onSubmit}>
        <label className="auth-field">
          <input
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder=" "
            required
          />
          <span>이메일</span>
        </label>
        <label className="auth-field">
          <input
            type="text"
            name="displayName"
            autoComplete="name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder=" "
          />
          <span>성명</span>
        </label>
        <label className="auth-field">
          <input
            type="text"
            name="username"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder=" "
            required
          />
          <span>사용자 이름</span>
        </label>
        <label className="auth-field auth-field--password">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder=" "
            required
          />
          <span>비밀번호</span>
          {password.length > 0 && (
            <button
              type="button"
              className="auth-toggle"
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? '숨기기' : '비밀번호 표시'}
            </button>
          )}
        </label>
        <button type="submit" className="auth-submit" disabled={!canSubmit}>
          {submitting ? '가입 중...' : '가입'}
        </button>
        {error ? <p className="auth-error">{error}</p> : null}
      </form>
    </AuthLayout>
  )
}
