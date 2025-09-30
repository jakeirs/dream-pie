import { Group, Picture } from '@shopify/react-native-skia'
import { SharedValue, useDerivedValue } from 'react-native-reanimated'

import { IParticle } from '../types/types'

interface ParticleRendererProps {
  particles: IParticle[]
  particlesShared: SharedValue<IParticle[]>
  renderTrigger: SharedValue<number>
}

export default function ParticleRenderer({
  particles,
  particlesShared,
  renderTrigger,
}: ParticleRendererProps) {
  return (
    <>
      {particles.map((particle, index) => (
        <ParticleItem
          key={index}
          index={index}
          particle={particle}
          particlesShared={particlesShared}
          renderTrigger={renderTrigger}
        />
      ))}
    </>
  )
}

interface ParticleItemProps {
  index: number
  particle: IParticle
  particlesShared: SharedValue<IParticle[]>
  renderTrigger: SharedValue<number>
}

function ParticleItem({
  index,
  particle,
  particlesShared,
  renderTrigger,
}: ParticleItemProps) {
  const transform = useDerivedValue(() => {
    // This dependency on renderTrigger forces re-computation
    const _trigger = renderTrigger.value
    const currentParticle = particlesShared.value[index]
    if (!currentParticle) {
      return [{ translateX: particle.x }, { translateY: particle.y }]
    }
    return [{ translateX: currentParticle.x }, { translateY: currentParticle.y }]
  }, [index, particlesShared, renderTrigger])

  return (
    <Group transform={transform}>
      <Picture picture={particle.picture} />
    </Group>
  )
}