import { IParticle, ParticleConfig } from '../../types/types'

export const makeImageParticles = (config: ParticleConfig): IParticle[] => {
  const result: IParticle[] = []

  const { density, stageWidth, stageHeight } = config

  // Validate dimensions
  if (!stageWidth || !stageHeight || stageWidth <= 0 || stageHeight <= 0) {
    return result
  }

  for (let x = 0; x < stageWidth; x += density) {
    for (let y = 0; y < stageHeight; y += density) {
      result.push({
        x: x,
        y: y,
        savedX: x,
        savedY: y,
        vx: 0,
        vy: 0,
      })
    }
  }

  return result
}