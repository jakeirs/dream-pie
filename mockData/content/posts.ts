/**
 * MOCK DATA LIFECYCLE - Posts
 *
 * WHEN CREATED: User creates post through CreatePostForm
 * WHERE CREATED: CreatePostForm, PostEditor components
 *
 * WHEN USED: News feeds, profile pages, post detail views
 * WHERE USED: PostFeed, PostCard, PostDetail components
 *
 * HOW DATA EVOLVES:
 * - CREATE: New post creation with text content
 * - READ: Feed display, post views
 * - UPDATE: Like/unlike, comment count updates
 * - DELETE: Post removal by user or admin
 *
 * RELATIONSHIPS:
 * - Users: posts.authorId -> users.id (many-to-one)
 * - Comments: posts.id -> comments.postId (one-to-many)
 */

import { Post, PostWithAuthor } from '@/types/content'
import { getUserById } from '@/mockData/users'

export const mockPosts: Post[] = [
  {
    id: 'post_1',
    authorId: '1',
    content:
      'Just finished implementing React Native Reanimated 4.x gestures! The new API is much cleaner 🚀',
    likesCount: 24,
    commentsCount: 7,
    createdAt: '2024-01-10T14:22:00Z',
  },
  {
    id: 'post_2',
    authorId: '2',
    content:
      'Working on some new UI designs for a social app. Love how NativeWind makes styling so much easier! 🎨',
    likesCount: 18,
    commentsCount: 3,
    createdAt: '2024-01-10T10:20:00Z',
  },
  {
    id: 'post_3',
    authorId: '3',
    content:
      'Finally released my space exploration game demo! Check it out and let me know what you think 🎮🚀',
    likesCount: 45,
    commentsCount: 12,
    createdAt: '2024-01-09T20:30:00Z',
  },
  {
    id: 'post_4',
    authorId: '1',
    content:
      'Pro tip: Use absolute imports with path aliases to keep your React Native code clean and maintainable 💡',
    likesCount: 31,
    commentsCount: 5,
    createdAt: '2024-01-09T16:15:00Z',
  },
]

export const mockPostsWithAuthors: PostWithAuthor[] = mockPosts.map((post) => {
  const author = getUserById(post.authorId)
  return {
    ...post,
    author: {
      id: author?.id || '',
      username: author?.username || '',
      avatar: author?.avatar,
    },
    isLikedByUser: Math.random() > 0.5, // Random like status
  }
})

// Helper functions
export const getPostById = (id: string): Post | undefined => {
  return mockPosts.find((post) => post.id === id)
}

export const getPostsByAuthorId = (authorId: string): Post[] => {
  return mockPosts.filter((post) => post.authorId === authorId)
}
