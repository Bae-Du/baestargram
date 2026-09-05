import { NavLink } from 'react-router-dom'
import { currentUser } from '../../data/mock'
import {
  CreateIcon,
  HomeIcon,
  MessagesIcon,
  ReelsIcon,
  SearchIcon,
} from '../icons/NavIcons'
import { Avatar } from '../common/Avatar'
import './Sidebar.css'

const links = [
  { to: '/', label: '홈', icon: HomeIcon, end: true },
  { to: '/explore', label: '검색', icon: SearchIcon },
  { to: '/reels', label: '릴스', icon: ReelsIcon },
  { to: '/messages', label: '메시지', icon: MessagesIcon },
  { to: '/create', label: '만들기', icon: CreateIcon },
]

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <NavLink to="/" className="sidebar__logo">
          baestargram
        </NavLink>
      </div>

      <nav className="sidebar__nav" aria-label="주요">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `sidebar__link${isActive ? ' sidebar__link--active' : ''}`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className="sidebar__icon" filled={isActive} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `sidebar__link${isActive ? ' sidebar__link--active' : ''}`
          }
        >
          <Avatar user={currentUser} size="sm" />
          <span>프로필</span>
        </NavLink>
      </nav>
    </aside>
  )
}
