/**
 * MOCK DATA LIFECYCLE - Pose Prompts
 *
 * WHEN CREATED: App initialization, prompt system loading
 * WHERE CREATED: PromptService.loadPrompts(), AI generation setup
 *
 * WHEN USED: AI image generation, pose-specific prompt selection
 * WHERE USED: CreatePage, AI generation workflow, PosePrompt components
 *
 * HOW DATA EVOLVES:
 * - CREATE: New prompts added for poses by content team
 * - READ: Prompt retrieval for AI generation, prompt display
 * - UPDATE: Prompt optimization, effectiveness improvements
 * - DELETE: Deprecated prompts removal
 *
 * RELATIONSHIPS:
 * - Poses: posePrompts.poseId -> poses.id (one-to-one)
 * - Creations: posePrompts.promptId -> creations.promptUsed (many-to-many)
 */

import { PosePrompt } from '@/types/prompts'

export const mockPosePrompts: PosePrompt[] = [
  {
    pose: 'Professional Portrait',
    poseId: 'pose_1',
    promptId: 'prompt_1',
    prompt: 'Professional headshot photo of a confident person in business attire, clean studio lighting, sharp focus, looking directly at camera with a warm professional smile',
  },
  {
    pose: 'Elegant Dress',
    poseId: 'pose_2',
    promptId: 'prompt_2',
    prompt: 'Elegant fashion portrait of a person in a sophisticated dress, graceful posture, soft natural lighting, refined styling, high-end fashion photography aesthetic',
  },
  {
    pose: 'Casual Confidence',
    poseId: 'pose_3',
    promptId: 'prompt_3',
    prompt: 'Relaxed casual portrait showing natural confidence, friendly approachable expression, comfortable everyday clothing, warm natural lighting',
  },
  {
    pose: 'Travel Ready',
    poseId: 'pose_4',
    promptId: 'prompt_4',
    prompt: 'Adventure-ready travel photo with outdoor exploration gear, confident adventurous pose, natural outdoor lighting, scenic background suggesting wanderlust',
  },
  {
    pose: 'Creative Expression',
    poseId: 'pose_5',
    promptId: 'prompt_5',
    prompt: 'Artistic creative portrait with unique expressive pose, dynamic composition, dramatic lighting, showcasing individual personality and artistic flair',
  },
  {
    pose: 'Fitness Power',
    poseId: 'pose_6',
    promptId: 'prompt_6',
    prompt: 'Athletic fitness portrait showing strength and vitality, powerful confident stance, activewear, energetic lighting that emphasizes physical fitness and health',
  },
]

export const getPosePromptByPoseId = (poseId: string): PosePrompt | undefined => {
  return mockPosePrompts.find((prompt) => prompt.poseId === poseId)
}

export const getPosePromptByPromptId = (promptId: string): PosePrompt | undefined => {
  return mockPosePrompts.find((prompt) => prompt.promptId === promptId)
}