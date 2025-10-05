/**
 * COLLAGE DETECTION PROMPT
 *
 * Used to validate if a generated image is a collage (side-by-side comparison)
 * or a single unified photograph.
 *
 * WHEN USED: After initial photo generation with FAL AI
 * WHERE USED: services/generate-photo/validation/collage-check.ts
 *
 * EXPECTED OUTPUT: JSON object { "isCollage": boolean }
 */

export const CHECK_COLLAGE_PROMPT = `
Analyze this image carefully and determine if it is a collage or a single unified photograph.

A COLLAGE is defined as:
- Two or more distinct images placed side-by-side
- Clear vertical or horizontal divisions between different photos
- Split-screen or comparison layout showing multiple subjects or scenes
- Multiple people from different photo sources in the same frame
- Obvious compositional boundaries or frames within the image

A SINGLE PHOTOGRAPH is defined as:
- One unified scene with consistent lighting and background
- One person in one cohesive setting
- No visible divisions or splits in the composition
- Natural photographic composition without artificial boundaries

Respond ONLY with a valid JSON object in this exact format:
{
  "isCollage": true or false
}

Do not include any explanation or additional text. Only return the JSON object.
`.trim()
