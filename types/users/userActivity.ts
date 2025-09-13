/**
 * User Activity Types - Simple activity tracking
 *
 * LIFECYCLE TRACKING:
 * - WHEN CREATED: User likes posts, follows users, creates posts
 * - WHERE CREATED: PostCard like button, FollowButton, CreatePost component
 * - WHEN USED: Activity feed, user notifications
 * - WHERE USED: ActivityFeed, NotificationPanel components
 * - HOW DATA EVOLVES:
 *   - CREATE: User performs action (like, follow, post)
 *   - READ: Activity feed display, notification count
 *   - UPDATE: Activity visibility, read status
 *   - DELETE: User privacy settings, data cleanup
 */

export interface UserActivity {
  id: string;
  userId: string;
  type: ActivityType;
  targetId: string;
  timestamp: string;
}

export type ActivityType = 'like' | 'follow' | 'post' | 'comment';