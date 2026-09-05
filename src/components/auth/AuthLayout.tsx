import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import './AuthLayout.css'

type AuthLayoutProps = {
  children: ReactNode
  switchText: string
  switchLabel: string
  switchTo: string
}

export function AuthLayout({ children, switchText, switchLabel, switchTo }: AuthLayoutProps) {
  return (
    <div className="auth-page">
      <div className="auth-page__stage">
        <div className="auth-phone" aria-hidden="true">
          <div className="auth-phone__frame">
            <img
              src="https://picsum.photos/seed/baestar-login/390/844"
              alt=""
            />
          </div>
        </div>

        <div className="auth-page__panel">
          <section className="auth-card">{children}</section>
          <section className="auth-card auth-card--switch">
            <p>
              {switchText} <Link to={switchTo}>{switchLabel}</Link>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
