/**
 * DREAM PIE TYPES - Pose Prompts
 *
 * Defines the structure for pose prompt data in the Dream Pie app
 * Used for connecting poses with AI generation prompts
 */

export interface PosePrompt {
  pose: string      // name of the pose
  poseId: string    // reference to pose ID
  promptId: string  // unique prompt identifier
  prompt: string    // actual prompt text for AI generation
}