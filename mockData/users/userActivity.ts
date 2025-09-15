/**
 * MOCK DATA LIFECYCLE - User Activities
 *
 * WHEN CREATED: User likes posts, follows users, creates posts/comments
 * WHERE CREATED: PostCard like button, FollowButton, CreatePost form
 *
 * WHEN USED: Activity feed, user notifications
 * WHERE USED: ActivityFeed, NotificationPanel components
 *
 * HOW DATA EVOLVES:
 * - CREATE: User performs action (like, follow, post, comment)
 * - READ: Activity feed display, notification count
 * - UPDATE: Activity visibility changes
 * - DELETE: Privacy settings, data cleanup
 *
 * RELATIONSHIPS:
 * - Users: activities.userId -> users.id (many-to-one)
 * - Posts: activities.targetId -> posts.id (when type is 'like' or 'post')
 */

import { UserActivity, ActivityType } from '@/types/users';

export const mockUserActivities: UserActivity[] = [
  {
    id: '1',
    userId: '1',
    type: 'post',
    targetId: 'post_1',
    timestamp: '2024-01-10T14:22:00Z',
  },
  {
    id: '2',
    userId: '2',
    type: 'like',
    targetId: 'post_1',
    timestamp: '2024-01-10T13:15:00Z',
  },
  {
    id: '3',
    userId: '3',
    type: 'follow',
    targetId: '1',
    timestamp: '2024-01-10T12:30:00Z',
  },
  {
    id: '4',
    userId: '1',
    type: 'comment',
    targetId: 'comment_1',
    timestamp: '2024-01-10T11:45:00Z',
  },
  {
    id: '5',
    userId: '2',
    type: 'post',
    targetId: 'post_2',
    timestamp: '2024-01-10T10:20:00Z',
  },
];

// Helper functions
export const getActivitiesByUserId = (userId: string): UserActivity[] => {
  return mockUserActivities.filter((activity) => activity.userId === userId);
};

export const getActivitiesByType = (type: ActivityType): UserActivity[] => {
  return mockUserActivities.filter((activity) => activity.type === type);
};
