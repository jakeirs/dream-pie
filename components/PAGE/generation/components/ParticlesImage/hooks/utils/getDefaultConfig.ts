import { ParticleConfig } from '../../types/types'

export const getDefaultParticleConfig = (
  stageWidth: number,
  stageHeight: number
): ParticleConfig => ({
  density: 35,
  particleSize: 15,
  friction: 0.88,
  moveSpeed: 0.88,
  minPushDistance: 100,
  stageWidth,
  stageHeight,
})
