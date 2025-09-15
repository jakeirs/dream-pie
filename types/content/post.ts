/**
 * Post Types - Simple social media posts
 *
 * LIFECYCLE TRACKING:
 * - WHEN CREATED: User creates post through CreatePostForm
 * - WHERE CREATED: CreatePostForm, PostEditor components
 * - WHEN USED: News feeds, profile pages, post detail views
 * - WHERE USED: PostFeed, PostCard, PostDetail components
 * - HOW DATA EVOLVES:
 *   - CREATE: New post creation with text content
 *   - READ: Feed display, post views
 *   - UPDATE: Like/unlike, comment count updates
 *   - DELETE: Post removal by user or admin
 */

export interface Post {
  id: string;
  authorId: string;
  content: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
}

export interface PostWithAuthor extends Post {
  author: {
    id: string;
    username: string;
    avatar?: string;
  };
  isLikedByUser: boolean;
}
