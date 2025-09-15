/**
 * Content Mock Data - Exports
 *
 * Central export point for all content-related mock data
 */

// Post data
export { mockPosts, mockPostsWithAuthors, getPostById, getPostsByAuthorId } from './posts';

// Comment data
export {
  mockComments,
  mockCommentsWithAuthors,
  getCommentsByPostId,
  getCommentsByAuthorId,
} from './comments';
