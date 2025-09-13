/**
 * Comment Types - Simple comment structures
 *
 * LIFECYCLE TRACKING:
 * - WHEN CREATED: User comments on posts
 * - WHERE CREATED: CommentForm component
 * - WHEN USED: Post detail pages, comment lists
 * - WHERE USED: CommentList, PostDetail components
 * - HOW DATA EVOLVES:
 *   - CREATE: New comment on post
 *   - READ: Comment display in post
 *   - UPDATE: Like/unlike comment
 *   - DELETE: Comment removal
 */

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  likesCount: number;
  createdAt: string;
}

export interface CommentWithAuthor extends Comment {
  author: {
    id: string;
    username: string;
    avatar?: string;
  };
  isLikedByUser: boolean;
}