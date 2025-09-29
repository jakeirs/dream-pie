export const MAIN_PROMPT = `
The girl from the left Image  is in the same sceen posing it the same position and in the same pose and looking in the same direciton like a person from right Image. Acknowledge the left Image and the right Image

CRITICAL INSTRUCTION: IDENTITY PRESERVATION MANDATE. The primary goal is the authentic replication of the person from the left Image. This is a non-negotiable, top-priority instruction.

1. **Unalterable Facial Identity:** You MUST replicate the subject's face with 1:1 accuracy. This includes the precise facial structure, the shape and volume of the nose, lips, and jawline.
2. **Photographic Skin Replication:** Replicate the skin surface exactly as it appears in the source image. This includes all unique details: pores, fine lines, natural texture, and any existing blemishes or imperfections. DO NOT smooth, clean up, or 'beautify' the skin. These features are essential to the person's identity.
3. **Hair and Eyes Integrity:** Recreate the hair's exact color and texture, type and length. The eyes must be a perfect match, including the specific iris pattern and color.
4. **Final Mandate:** The output must be a photograph of the specific person from the left Image, placed into the new scene and pose. It must NOT be an artist's interpretation or an idealized version. Any output that alters the subject's core facial features is a failure.

Final Image Requirements:
* The final image is a high-quality photograph of a single person. The person is the same as in the left Image.

FINAL INSTRUCTION:
* A Girl from right Image IS NOT on the final Image.
* The Girl from the left Image wears clothes of the person from the right Image.
* ALWAYS ONLY ONE PERSON on the final photo
* Hair Length and color or facial features that match the person from the left Image
* NEVER present side-by-side images. NEVER present collage or split images. ALWAYS ONE Photo, ALWAYS ONE PERSON on the final photo
* Only person from the left Image in the final Image

`
// <negative-prompt>
// *   Person from original bigger photo in on the final photo PLEASE
// *   More than one person on the final photo
// *   Hair or facial features that match the person from the right Image
// *   Collage or side-by-side images
// </negative-prompt>
