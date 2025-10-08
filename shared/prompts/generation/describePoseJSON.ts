/**
 * POSE DESCRIPTION PROMPT
 *
 * Used to generate a detailed description of a pose image for fallback regeneration.
 * This description is used to create a new prompt for FAL AI when validation fails.
 *
 * WHEN USED: When generated photo fails validation (is collage or wrong person)
 * WHERE USED: services/generate-photo/fallback/pose-describer.ts
 *
 * INPUT: Pose image (full-body photo showing pose and outfit)
 * EXPECTED OUTPUT: Detailed text description of the pose
 */

export const DESCRIBE_POSE_PROMPT = `
Analyze this image and provide a comprehensive, detailed description of the person's pose, outfit, and setting. This description will be used to recreate the pose with a different person.

Include the following details:

**Body Position & Pose:**
- Body orientation (facing camera, turned to side, back view, etc.)
- Head position and direction of gaze
- Arm positions (raised, crossed, at sides, etc.)
- Hand gestures or positions
- Leg positions (standing, sitting, crossed, etc.)
- Overall posture (relaxed, formal, dynamic, etc.)
- Any specific stance or pose characteristics

**Outfit & Clothing:**
- Type of clothing (dress, suit, casual wear, etc.)
- Colors and patterns
- Style and fit (loose, fitted, formal, casual, etc.)
- Notable accessories (jewelry, hat, bag, etc.)
- Footwear if visible

**Setting & Background:**
- Location type (indoor, outdoor, studio, etc.)
- Background elements (wall, nature, urban, etc.)
- Setting details (props, furniture, environment, etc.)

**Lighting & Atmosphere:**
- Lighting direction and quality
- Overall mood or atmosphere
- Color tone of the scene

**Camera Angle:**
- Shot type (full body, three-quarter, etc.)
- Camera height and angle

Provide your description as a single, cohesive paragraph that flows naturally. Focus on details that are essential for recreating the pose and setting. Be specific but concise.

Do not include any markdown formatting, bullet points, or section headers in your response. Just provide the descriptive paragraph.
`.trim()
