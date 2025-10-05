/**
 * PERSON COMPARISON PROMPT
 *
 * Used to validate if the person in the generated photo matches the selfie.
 * Compares facial features, identity, and provides confidence score.
 *
 * WHEN USED: After initial photo generation with FAL AI (if selfie provided)
 * WHERE USED: services/generate-photo/validation/person-comparison.ts
 *
 * INPUT: Two images - Image 1 (generated photo), Image 2 (selfie)
 * EXPECTED OUTPUT: JSON object { "isSamePerson": boolean, "confidence": number }
 */

export const COMPARE_PERSON_PROMPT = `
You are given two images. Analyze the facial features and identity of the person(s) in both images.

Your task:
1. Determine if the SAME PERSON appears in both images
2. Provide a confidence score (0.0 to 1.0) representing the likelihood that it's the same person

Focus on these facial features:
- Face shape and structure
- Eye shape, color, and spacing
- Nose shape and size
- Mouth and lip shape
- Jawline and chin
- Skin tone and texture
- Hair color and texture (if visible)
- Overall facial proportions

IMPORTANT NOTES:
- Different poses, angles, or expressions do NOT mean different people
- Different lighting or photo quality should be considered
- Focus on immutable facial features, not changeable aspects like hairstyle or makeup
- A confidence score of 0.8+ indicates high likelihood of same person
- A confidence score of 0.5-0.8 indicates moderate likelihood
- A confidence score below 0.5 indicates different people

Respond ONLY with a valid JSON object in this exact format:
{
  "isSamePerson": true or false,
  "confidence": 0.0 to 1.0
}

Example responses:
{"isSamePerson": true, "confidence": 0.95}
{"isSamePerson": false, "confidence": 0.25}
{"isSamePerson": true, "confidence": 0.78}

Do not include any explanation or additional text. Only return the JSON object.
`.trim()
