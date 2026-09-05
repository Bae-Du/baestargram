import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/auth/AuthLayout'
import { useAuth } from '../auth/AuthContext'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/'

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const canSubmit = username.trim().length > 0 && password.length > 0 && !submitting

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!canSubmit) return
    setError('')
    setSubmitting(true)
    try {
      await login(username, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인에 실패했어요.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout switchText="계정이 없으신가요?" switchLabel="가입하기" switchTo="/signup">
      <h1 className="auth-logo">baestargram</h1>
      <form className="auth-form" onSubmit={onSubmit}>
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
          <span>전화번호, 사용자 이름 또는 이메일</span>
        </label>
        <label className="auth-field auth-field--password">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            autoComplete="current-password"
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
          {submitting ? '로그인 중...' : '로그인'}
        </button>
        {error ? <p className="auth-error">{error}</p> : null}
      </form>
      <div className="auth-divider">또는</div>
      <p className="auth-hint">
        FastAPI 연결 전에는 목업 계정으로 로그인돼요.
        <br />
        비밀번호는 6자 이상이면 됩니다.
      </p>
    </AuthLayout>
  )
}
