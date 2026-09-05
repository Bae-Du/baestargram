type IconProps = {
  className?: string
  filled?: boolean
}

export function HomeIcon({ className, filled }: IconProps) {
  if (filled) {
    return (
      <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9.005 16.545a2.997 2.997 0 0 1 2.997-2.997h0A2.997 2.997 0 0 1 15 16.545V22h7V11.543L12 2 2 11.543V22h7.005Z" />
      </svg>
    )
  }
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9.005 16.545a2.997 2.997 0 0 1 2.997-2.997h0A2.997 2.997 0 0 1 15 16.545V22h7V11.543L12 2 2 11.543V22h7.005Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function SearchIcon({ className, filled }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M19 10.5A8.5 8.5 0 1 1 10.5 2a8.5 8.5 0 0 1 8.5 8.5Z"
        stroke="currentColor"
        strokeWidth={filled ? 2.5 : 2}
      />
      <path d="M16.5 16.5 22 22" stroke="currentColor" strokeWidth={filled ? 2.5 : 2} strokeLinecap="round" />
    </svg>
  )
}

export function ReelsIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2" />
      <path d="M9.5 8.5v7l6-3.5-6-3.5Z" fill="currentColor" />
    </svg>
  )
}

export function MessagesIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M22 12c0 4.97-4.48 9-10 9a10.9 10.9 0 0 1-4.53-.97L2 21l1.2-4.2A8.7 8.7 0 0 1 2 12C2 7.03 6.48 3 12 3s10 4.03 10 9Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function CreateIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2" />
      <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function HeartIcon({ className, filled }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      aria-hidden="true"
    >
      <path
        d="M12 21s-6.7-4.35-9.33-8.1C.7 10.2 1.2 6.5 4.05 4.9 6.1 3.75 8.55 4.2 10 5.85 11.45 4.2 13.9 3.75 15.95 4.9c2.85 1.6 3.35 5.3 1.38 8-2.63 3.75-9.33 8.1-9.33 8.1Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function CommentIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20.656 17.008a9.002 9.002 0 1 0-3.3 3.3l3.944.7-.644-4Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ShareIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M22 3 9.2 10.4M22 3l-7.4 18.1-3.4-7.7L2 9.6 22 3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function BookmarkIcon({ className, filled }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} aria-hidden="true">
      <path
        d="M20 22l-8-5.5L4 22V5a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v17Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function MoreIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="6" cy="12" r="1.5" fill="currentColor" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <circle cx="18" cy="12" r="1.5" fill="currentColor" />
    </svg>
  )
}
