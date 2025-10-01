export interface IParticle {
  x: number
  y: number
  savedX: number
  savedY: number
  vx: number
  vy: number
}

export interface ParticleConfig {
  density: number
  particleSize: number
  friction: number
  moveSpeed: number
  minPushDistance: number
  stageWidth: number
  stageHeight: number
}

export interface PixelatedEffectState {
  particles: IParticle[]
  isInitialized: boolean
}

export interface InformationPosition {
  x: number
  y: number
}

export interface InformationState {
  message: string
  isVisible: boolean
  position: InformationPosition
}