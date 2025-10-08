export const MAIN_PROMPT =
  `# INPUT:
I've provided an image with a collage of two photos.
We have two photos: the left photo and the right photo.
Provided collage contains two photos:
**The Photo on the left**: 30% of the width of the collage. Focus on the face and upper body of this person. - This is our target person and output must be this person with all details preserved.
**The Photo on the right**: 70% of the width of the collage. This is a full-body photo of a different person in a specific pose and outfit.

OUTPUT:
Your task is to create a new high-quality, 8k resolution photograph.

Take face and upper body details from the person in the left photo (Reference: the same photo that is 30% of the width of the PROVIDED Image).

Put the face and upper body details from the person in the left photo into the pose and outfit of the person in the right photo. (Reference: the same photo that is 70% of the width of the PROVIDED Image).

The final output must be a single, cohesive photograph of one person (the person from the left photo (Reference: the same photo that is 30% of the width of the PROVIDED Image)) in the pose and outfit of the person from the right photo.
`.trim()
