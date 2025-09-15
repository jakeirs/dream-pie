/**
 * MOCK DATA LIFECYCLE - Users
 *
 * WHEN CREATED: User registration, demo data seeding
 * WHERE CREATED: AuthService.register(), DataSeeder.seedUsers()
 *
 * WHEN USED: Profile pages, user cards, comment sections
 * WHERE USED: ProfilePage, UserCard, CommentList components
 *
 * HOW DATA EVOLVES:
 * - CREATE: New user accounts via registration
 * - READ: Profile views, user displays in posts/comments
 * - UPDATE: Profile edits, avatar changes
 * - DELETE: Account deactivation
 *
 * RELATIONSHIPS:
 * - Posts: users.id -> posts.authorId (one-to-many)
 * - Comments: users.id -> comments.authorId (one-to-many)
 */

import { User, UserProfile } from '@/types/users';

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'alex_dev',
    email: 'alex@example.com',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    bio: '🚀 React Native developer',
    createdAt: '2023-01-15T10:30:00Z',
  },
  {
    id: '2',
    username: 'maria_design',
    email: 'maria@example.com',
    avatar:
      'https://images.unsplash.com/photo-1494790108755-2616b612b5a2?w=150&h=150&fit=crop&crop=face',
    bio: '🎨 UX Designer',
    createdAt: '2023-03-22T16:45:00Z',
  },
  {
    id: '3',
    username: 'david_games',
    email: 'david@example.com',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    bio: '🎮 Game developer',
    createdAt: '2023-06-10T09:20:00Z',
  },
];

export const mockUserProfiles: UserProfile[] = mockUsers.map((user, index) => ({
  ...user,
  isFollowing: index % 2 === 0,
  followersCount: Math.floor(Math.random() * 1000) + 100,
}));

// Helper functions
export const getUserById = (id: string): User | undefined => {
  return mockUsers.find((user) => user.id === id);
};
