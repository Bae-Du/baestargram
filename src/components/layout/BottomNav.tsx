import { NavLink } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import {
  CreateIcon,
  HomeIcon,
  ReelsIcon,
  SearchIcon,
} from '../icons/NavIcons'
import { Avatar } from '../common/Avatar'
import './BottomNav.css'

const links = [
  { to: '/', icon: HomeIcon, end: true, label: '홈' },
  { to: '/explore', icon: SearchIcon, label: '검색' },
  { to: '/create', icon: CreateIcon, label: '만들기' },
  { to: '/reels', icon: ReelsIcon, label: '릴스' },
]

export function BottomNav() {
  const { user } = useAuth()
  if (!user) return null

  return (
    <nav className="bottom-nav" aria-label="모바일">
      {links.map(({ to, icon: Icon, end, label }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          aria-label={label}
          className={({ isActive }) =>
            `bottom-nav__link${isActive ? ' bottom-nav__link--active' : ''}`
          }
        >
          {({ isActive }) => <Icon className="bottom-nav__icon" filled={isActive} />}
        </NavLink>
      ))}
      <NavLink
        to="/profile"
        aria-label="프로필"
        className={({ isActive }) =>
          `bottom-nav__link${isActive ? ' bottom-nav__link--active' : ''}`
        }
      >
        <Avatar user={user} size="sm" />
      </NavLink>
    </nav>
  )
}
