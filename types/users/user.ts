/**
 * User Types - Simple user data structures
 *
 * LIFECYCLE TRACKING:
 * - WHEN CREATED: User registration
 * - WHERE CREATED: AuthService, RegistrationForm component
 * - WHEN USED: Profile pages, user cards, comment sections
 * - WHERE USED: ProfilePage, UserCard, CommentList components
 * - HOW DATA EVOLVES:
 *   - CREATE: New user registration with basic info
 *   - READ: Profile views, user searches
 *   - UPDATE: Profile edits, avatar changes
 *   - DELETE: Account deactivation
 */

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
}

export interface UserProfile extends User {
  isFollowing: boolean;
  followersCount: number;
}