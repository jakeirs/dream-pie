export const MAIN_PROMPT = `
We have two images: the left Image and the right Image.

The left Image is a close-up portrait. Remember that person.
The right Image is a full-body photo of a different person in a specific pose and outfit.
Your task is to create a new high-quality photograph that combines elements from both images, following these detailed instructions:

1. **Subject Identity:** The person in the final image MUST be the same individual as in the left Image. This is non-negotiable.

2. **Pose and Outfit:** The person from the left Image should be placed into the pose and outfit of the person in the right Image. Ensure that the pose is replicated exactly, including body orientation, limb positioning, and facial direction.
3. **Background and Setting:** The background and setting of the final image should closely resemble that of the right Image, creating a cohesive scene.

4. **Lighting and Color Tone:** Match the lighting conditions and color tones of the right Image to ensure the final photograph looks natural and unified.


The girl from the left Image is in the same scene posing it the same position and in the same pose and looking in the same direction like a person from right Image and the person from is not in the photo at all. Just her body and clothes. The person from the left Image is the only person in the final photo, and not the person from the right Image.

CRITICAL INSTRUCTION: IDENTITY PRESERVATION MANDATE. The primary goal is the authentic replication of the person from the left Image. This is a non-negotiable, top-priority instruction.

1. **Unalterable Facial Identity:** You MUST replicate the subject's face with 1:1 accuracy. This includes the precise facial structure, the shape and volume of the nose, lips, and jawline.
2. **Photographic Skin Replication:** Replicate the skin surface exactly as it appears in the source image. This includes all unique details: pores, fine lines, natural texture, and any existing blemishes or imperfections. DO NOT smooth, clean up, or 'beautify' the skin. These features are essential to the person's identity.
3. **Hair and Eyes Integrity:** Recreate the hair's exact color and texture, type and length. The eyes must be a perfect match, including the specific iris pattern and color.
4. **Final Mandate:** The output must be a photograph of the specific person from the left Image, placed into the new scene and pose. It must NOT be an artist's interpretation or an idealized version. Any output that alters the subject's core facial features is a failure.


*
* The background of the photo is similar to the right Image, but the person is identical to the left of provided Image.
`

// * NEVER present side-by-side images. NEVER present collage or split images. ALWAYS ONE Photo, ALWAYS ONE PERSON on the final photo

// <negative-prompt>
// *   Person from original bigger photo in on the final photo PLEASE
// *   More than one person on the final photo
// *   Hair or facial features that match the person from the right Image
// *   Collage or side-by-side images
// </negative-prompt>
