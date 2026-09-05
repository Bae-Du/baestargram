import type { User } from '../../types'
import './Avatar.css'

type AvatarProps = {
  user: Pick<User, 'username' | 'avatarUrl'>
  size?: 'sm' | 'md' | 'lg' | 'xl'
  ring?: boolean
  seen?: boolean
}

export function Avatar({ user, size = 'md', ring = false, seen = false }: AvatarProps) {
  return (
    <span
      className={[
        'avatar',
        `avatar--${size}`,
        ring ? 'avatar--ring' : '',
        ring && seen ? 'avatar--seen' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <img src={user.avatarUrl} alt={`${user.username} 프로필`} />
    </span>
  )
}
