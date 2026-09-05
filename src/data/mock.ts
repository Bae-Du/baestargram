import type { ExploreItem, Post, Story, User } from '../types'

export const currentUser: User = {
  id: 'me',
  username: 'baestar',
  displayName: 'Baestar',
  avatarUrl: 'https://i.pravatar.cc/150?u=baestar',
  bio: 'baestargram 🌱\nReact · Frontend',
  postsCount: 12,
  followersCount: 1284,
  followingCount: 312,
}

const users: User[] = [
  {
    id: 'u1',
    username: 'mina.photo',
    displayName: 'Mina',
    avatarUrl: 'https://i.pravatar.cc/150?u=mina',
    bio: 'Film & light',
    postsCount: 48,
    followersCount: 9200,
    followingCount: 410,
  },
  {
    id: 'u2',
    username: 'jun.dev',
    displayName: 'Jun',
    avatarUrl: 'https://i.pravatar.cc/150?u=jun',
    bio: 'Code & coffee',
    postsCount: 31,
    followersCount: 2100,
    followingCount: 180,
  },
  {
    id: 'u3',
    username: 'sooyoon',
    displayName: 'Soo Yoon',
    avatarUrl: 'https://i.pravatar.cc/150?u=sooyoon',
    bio: 'Daily notes',
    postsCount: 102,
    followersCount: 15400,
    followingCount: 520,
  },
  {
    id: 'u4',
    username: 'han.travels',
    displayName: 'Han',
    avatarUrl: 'https://i.pravatar.cc/150?u=han',
    bio: 'On the road',
    postsCount: 76,
    followersCount: 6800,
    followingCount: 390,
  },
  {
    id: 'u5',
    username: 'yuna.eats',
    displayName: 'Yuna',
    avatarUrl: 'https://i.pravatar.cc/150?u=yuna',
    bio: 'Taste first',
    postsCount: 55,
    followersCount: 4300,
    followingCount: 260,
  },
]

export const stories: Story[] = [
  { id: 's0', user: currentUser, hasUnseen: false },
  ...users.map((user, i) => ({
    id: `s${i + 1}`,
    user,
    hasUnseen: i < 3,
  })),
]

export const posts: Post[] = [
  {
    id: 'p1',
    user: users[0],
    imageUrl: 'https://picsum.photos/seed/baestar1/1080/1080',
    caption: 'Golden hour on film 🎞️',
    likes: 1240,
    commentsCount: 48,
    createdAt: '2시간',
    liked: true,
  },
  {
    id: 'p2',
    user: users[1],
    imageUrl: 'https://picsum.photos/seed/baestar2/1080/1350',
    caption: '새 프로젝트 세팅 완료. baestargram 시작!',
    likes: 312,
    commentsCount: 19,
    createdAt: '5시간',
  },
  {
    id: 'p3',
    user: users[2],
    imageUrl: 'https://picsum.photos/seed/baestar3/1080/1080',
    caption: '주말 산책 코스 추천해요',
    likes: 2890,
    commentsCount: 112,
    createdAt: '1일',
    saved: true,
  },
  {
    id: 'p4',
    user: users[3],
    imageUrl: 'https://picsum.photos/seed/baestar4/1080/1200',
    caption: '제주 동쪽, 바람 좋은 날',
    likes: 876,
    commentsCount: 33,
    createdAt: '2일',
  },
]

export const exploreItems: ExploreItem[] = Array.from({ length: 18 }, (_, i) => ({
  id: `e${i + 1}`,
  imageUrl: `https://picsum.photos/seed/explore${i + 1}/600/600`,
  likes: 100 + i * 37,
  commentsCount: 5 + (i % 12),
}))

export const profilePosts = posts.map((post, i) => ({
  ...post,
  id: `profile-${i}`,
  user: currentUser,
  imageUrl: `https://picsum.photos/seed/profile${i}/600/600`,
}))
