/**
 * MOCK DATA LIFECYCLE - Comments
 *
 * WHEN CREATED: User comments on posts
 * WHERE CREATED: CommentForm component
 *
 * WHEN USED: Post detail pages, comment lists
 * WHERE USED: CommentList, PostDetail components
 *
 * HOW DATA EVOLVES:
 * - CREATE: New comment on post
 * - READ: Comment display in post
 * - UPDATE: Like/unlike comment
 * - DELETE: Comment removal
 *
 * RELATIONSHIPS:
 * - Posts: comments.postId -> posts.id (many-to-one)
 * - Users: comments.authorId -> users.id (many-to-one)
 */

import { Comment, CommentWithAuthor } from '@/types/content';
import { getUserById } from '@/mockData/users';

export const mockComments: Comment[] = [
  {
    id: 'comment_1',
    postId: 'post_1',
    authorId: '2',
    content: 'This looks amazing! Can you share some code examples?',
    likesCount: 5,
    createdAt: '2024-01-10T15:30:00Z',
  },
  {
    id: 'comment_2',
    postId: 'post_1',
    authorId: '3',
    content: 'Great work! I had similar issues with the old gesture API.',
    likesCount: 3,
    createdAt: '2024-01-10T16:15:00Z',
  },
  {
    id: 'comment_3',
    postId: 'post_2',
    authorId: '1',
    content: 'NativeWind is a game changer for React Native styling!',
    likesCount: 8,
    createdAt: '2024-01-10T11:45:00Z',
  },
  {
    id: 'comment_4',
    postId: 'post_3',
    authorId: '2',
    content: 'Just tried the demo - absolutely incredible! 🤩',
    likesCount: 12,
    createdAt: '2024-01-09T21:20:00Z',
  },
];

export const mockCommentsWithAuthors: CommentWithAuthor[] = mockComments.map(comment => {
  const author = getUserById(comment.authorId);
  return {
    ...comment,
    author: {
      id: author?.id || '',
      username: author?.username || '',
      avatar: author?.avatar,
    },
    isLikedByUser: Math.random() > 0.6, // Random like status
  };
});

// Helper functions
export const getCommentsByPostId = (postId: string): Comment[] => {
  return mockComments.filter(comment => comment.postId === postId);
};

export const getCommentsByAuthorId = (authorId: string): Comment[] => {
  return mockComments.filter(comment => comment.authorId === authorId);
};