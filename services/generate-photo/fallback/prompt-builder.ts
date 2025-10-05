/**
 * Build regeneration prompt for FAL AI
 *
 * Creates a comprehensive prompt for FAL AI to generate a photo of the person
 * from the selfie in the pose described by the pose description.
 *
 * This prompt combines:
 * - Identity preservation instructions (use person from selfie)
 * - Pose recreation instructions (from pose description)
 * - Quality and realism requirements
 *
 * @param poseDescription - Detailed description of the pose (from Gemini)
 * @returns Formatted prompt string for FAL AI
 */
export function buildRegenerationPrompt(poseDescription: string): string {
  return `
Create a high-quality, photorealistic image of the person from the provided selfie photo.

POSE AND SETTING REQUIREMENTS:
${poseDescription}

IDENTITY PRESERVATION (CRITICAL):
1. The person in the final image MUST be the exact same individual from the selfie photo
2. Preserve ALL facial features: face shape, nose, lips, jawline, eyes, skin tone, and texture
3. Do NOT alter, smooth, or beautify the person's face - maintain 1:1 accuracy
4. Replicate the person's natural skin texture including pores, lines, and any imperfections
5. Match the person's hair color, texture, type, and length exactly

POSE RECREATION:
1. Place the person in the exact pose described above
2. Match the body orientation, limb positioning, and facial direction
3. Ensure the outfit, colors, and style match the description
4. Recreate the background and setting as described
5. Match the lighting conditions and color tone

QUALITY REQUIREMENTS:
- Output must be a single, unified photograph (NOT a collage or side-by-side comparison)
- Natural, photorealistic quality
- Seamless integration of the person into the scene
- Professional photography standards

The final image should look like a natural photograph of the person from the selfie, taken in the described pose and setting.
`.trim()
}
