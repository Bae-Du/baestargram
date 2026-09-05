import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { ExplorePage } from './pages/ExplorePage'
import { HomePage } from './pages/HomePage'
import { PlaceholderPage } from './pages/PlaceholderPage'
import { ProfilePage } from './pages/ProfilePage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="explore" element={<ExplorePage />} />
          <Route
            path="reels"
            element={
              <PlaceholderPage
                title="릴스"
                description="릴스 피드는 곧 추가될 예정이에요."
              />
            }
          />
          <Route
            path="messages"
            element={
              <PlaceholderPage
                title="메시지"
                description="DM 화면은 곧 추가될 예정이에요."
              />
            }
          />
          <Route
            path="create"
            element={
              <PlaceholderPage
                title="새 게시물"
                description="게시물 작성 UI는 곧 추가될 예정이에요."
              />
            }
          />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
