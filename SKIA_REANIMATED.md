# React Native Skia + Reanimated Integration Guide

## Project Versions

- **@shopify/react-native-skia**: 2.2.12
- **react-native-reanimated**: 4.1.0
- **react-native-gesture-handler**: 2.28.0

## Table of Contents

1. [Core Concepts](#core-concepts)
2. [Shared Values vs Mutable Values](#shared-values-vs-mutable-values)
3. [Animation Patterns](#animation-patterns)
4. [Gesture Integration](#gesture-integration)
5. [Performance Optimization](#performance-optimization)
6. [Common Pitfalls](#common-pitfalls)
7. [Real-World Examples](#real-world-examples)

---

## Core Concepts

### How Skia + Reanimated Work Together

**✅ KEY PRINCIPLE**: Skia components automatically track and react to Reanimated shared values.

```typescript
import { Canvas, Circle } from '@shopify/react-native-skia'
import { useSharedValue, withTiming } from 'react-native-reanimated'

function AnimatedCircle() {
  const radius = useSharedValue(50)

  useEffect(() => {
    radius.value = withTiming(100, { duration: 1000 })
  }, [])

  return (
    <Canvas style={{ flex: 1 }}>
      {/* ✅ Skia components accept shared values directly as props */}
      <Circle cx={100} cy={100} r={radius} color="blue" />
    </Canvas>
  )
}
```

**❌ NO NEED FOR**:
- `createAnimatedComponent()`
- `useAnimatedProps()`
- Manual re-render triggers (in most cases)

---

## Shared Values vs Mutable Values

### `useSharedValue` - Reactive Values

**When to use**: When you need Skia components to react to value changes.

```typescript
import { useSharedValue } from 'react-native-reanimated'

// ✅ Creates a reactive value that Skia tracks
const x = useSharedValue(0)

// Skia components will automatically re-render when x changes
<Group transform={[{ translateX: x }]}>
  <Circle cx={50} cy={50} r={20} color="red" />
</Group>
```

**Characteristics**:
- ✅ Triggers Skia re-renders automatically
- ✅ Works with `useDerivedValue`
- ✅ Integrates with gesture handlers
- ⚠️ Performance overhead for many values (100+ objects)

---

### `makeMutable` - Non-Reactive Values

**When to use**: When you need to store complex data structures that update frequently but don't need automatic re-renders.

```typescript
import { makeMutable, useSharedValue } from 'react-native-reanimated'

// ❌ BAD: Skia won't know when particles change
const particles = makeMutable([{ x: 0, y: 0 }])

particles.value[0].x = 100 // Skia won't re-render!

// ✅ GOOD: Combine makeMutable with render trigger
const particles = makeMutable([{ x: 0, y: 0 }])
const renderTrigger = useSharedValue(0)

// Update particles
particles.value[0].x = 100
renderTrigger.value += 1 // Forces Skia to re-render
```

**Characteristics**:
- ✅ Efficient for storing large data structures
- ✅ Low memory overhead
- ❌ Does NOT trigger Skia re-renders
- ✅ Perfect for particle systems, game objects, bulk data

---

### The Render Trigger Pattern

**Problem**: You have 100+ objects stored in `makeMutable` and need efficient updates.

**Solution**: Use a single `useSharedValue` as a render trigger.

```typescript
interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  picture: SkPicture
}

function ParticleSystem() {
  // Store particles efficiently
  const particles = makeMutable<Particle[]>([])

  // Single reactive trigger for all particles
  const renderTrigger = useSharedValue(0)

  // Update particles in gesture or animation
  const gesture = Gesture.Pan().onChange((event) => {
    'worklet'
    const currentParticles = particles.value

    for (let i = 0; i < currentParticles.length; i++) {
      currentParticles[i].x += event.translationX
      currentParticles[i].y += event.translationY
    }

    // ✅ Trigger re-render for all particles at once
    renderTrigger.value += 1
  })

  // Render particles
  return (
    <Canvas>
      {initialParticles.map((particle, index) => (
        <ParticleItem
          key={index}
          index={index}
          particles={particles}
          renderTrigger={renderTrigger}
        />
      ))}
    </Canvas>
  )
}

function ParticleItem({ index, particles, renderTrigger }) {
  const transform = useDerivedValue(() => {
    // ✅ Read renderTrigger to force re-computation
    const _trigger = renderTrigger.value

    // ✅ Read current particle position
    const particle = particles.value[index]
    return [
      { translateX: particle.x },
      { translateY: particle.y }
    ]
  }, [renderTrigger])

  return (
    <Group transform={transform}>
      <Picture picture={particle.picture} />
    </Group>
  )
}
```

**Why This Works**:
1. `makeMutable` stores data efficiently (no overhead per particle)
2. Single `useSharedValue` provides reactivity
3. `useDerivedValue` re-computes when `renderTrigger` changes
4. All particle positions update in one render cycle

---

## Animation Patterns

### Pattern 1: Direct Shared Value (Simple Animations)

**Use Case**: Single object animations, simple transforms.

```typescript
function BouncingBall() {
  const y = useSharedValue(100)

  useEffect(() => {
    y.value = withRepeat(
      withTiming(300, { duration: 1000 }),
      -1,
      true
    )
  }, [])

  return (
    <Canvas style={{ flex: 1 }}>
      <Circle cx={100} cy={y} r={20} color="red" />
    </Canvas>
  )
}
```

---

### Pattern 2: Derived Values (Computed Properties)

**Use Case**: Complex calculations based on shared values.

```typescript
function RotatingCircle() {
  const rotation = useSharedValue(0)

  const transform = useDerivedValue(() => {
    return [
      { translateX: 100 },
      { translateY: 100 },
      { rotateZ: rotation.value }
    ]
  }, [rotation])

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(Math.PI * 2, { duration: 2000 }),
      -1
    )
  }, [])

  return (
    <Canvas>
      <Group transform={transform}>
        <Circle cx={0} cy={0} r={30} color="blue" />
      </Group>
    </Canvas>
  )
}
```

---

### Pattern 3: Frame Callbacks (Physics/Game Loops)

**Use Case**: Continuous updates, physics simulations, particle systems.

```typescript
function PhysicsSimulation() {
  const particles = makeMutable([
    { x: 100, y: 100, vx: 2, vy: 1 }
  ])
  const renderTrigger = useSharedValue(0)

  useFrameCallback(() => {
    'worklet'
    const p = particles.value[0]

    // Update physics
    p.x += p.vx
    p.y += p.vy

    // Bounce off walls
    if (p.x > 300 || p.x < 0) p.vx *= -1
    if (p.y > 500 || p.y < 0) p.vy *= -1

    // Trigger re-render
    renderTrigger.value += 1
  })

  const transform = useDerivedValue(() => {
    const _trigger = renderTrigger.value
    const p = particles.value[0]
    return [{ translateX: p.x }, { translateY: p.y }]
  })

  return (
    <Canvas>
      <Group transform={transform}>
        <Circle cx={0} cy={0} r={10} color="green" />
      </Group>
    </Canvas>
  )
}
```

---

## Gesture Integration

### Basic Gesture Pattern

```typescript
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { useSharedValue } from 'react-native-reanimated'
import { Canvas, Circle } from '@shopify/react-native-skia'

function DraggableCircle() {
  const x = useSharedValue(100)
  const y = useSharedValue(100)

  const gesture = Gesture.Pan()
    .onChange((event) => {
      'worklet'
      x.value += event.changeX
      y.value += event.changeY
    })

  return (
    <GestureDetector gesture={gesture}>
      <Canvas style={{ flex: 1 }}>
        <Circle cx={x} cy={y} r={30} color="purple" />
      </Canvas>
    </GestureDetector>
  )
}
```

---

### Advanced Gesture Pattern (Multiple Objects)

```typescript
function InteractiveParticles() {
  const particles = makeMutable([
    { x: 100, y: 100, vx: 0, vy: 0 },
    { x: 200, y: 150, vx: 0, vy: 0 },
    // ... more particles
  ])
  const renderTrigger = useSharedValue(0)

  const gesture = Gesture.Pan().onChange((event) => {
    'worklet'
    const touchX = event.x
    const touchY = event.y
    const pushDistance = 100

    // Update all particles based on touch position
    for (let i = 0; i < particles.value.length; i++) {
      const particle = particles.value[i]
      const dx = touchX - particle.x
      const dy = touchY - particle.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < pushDistance) {
        const angle = Math.atan2(dy, dx)
        const force = (pushDistance - dist) / pushDistance
        particle.vx -= Math.cos(angle) * force * 5
        particle.vy -= Math.sin(angle) * force * 5
      }
    }

    renderTrigger.value += 1
  })

  return (
    <GestureDetector gesture={gesture}>
      <Canvas>
        {/* Render particles... */}
      </Canvas>
    </GestureDetector>
  )
}
```

---

### Gesture with Animation Feedback

```typescript
function InteractiveCard() {
  const scale = useSharedValue(1)
  const x = useSharedValue(0)

  const gesture = Gesture.Pan()
    .onStart(() => {
      'worklet'
      scale.value = withSpring(1.1)
    })
    .onChange((event) => {
      'worklet'
      x.value += event.changeX
    })
    .onEnd(() => {
      'worklet'
      scale.value = withSpring(1)
      x.value = withSpring(0)
    })

  const transform = useDerivedValue(() => [
    { translateX: x.value },
    { scale: scale.value }
  ])

  return (
    <GestureDetector gesture={gesture}>
      <Canvas>
        <Group transform={transform}>
          <Rect x={0} y={0} width={200} height={100} color="blue" />
        </Group>
      </Canvas>
    </GestureDetector>
  )
}
```

---

## Performance Optimization

### ✅ DO: Use makeMutable for Large Datasets

```typescript
// ✅ GOOD: Efficient for 1000+ particles
const particles = makeMutable<Particle[]>(initialParticles)
const renderTrigger = useSharedValue(0)
```

```typescript
// ❌ BAD: Creates 1000+ shared values
const particles = initialParticles.map(p => ({
  x: useSharedValue(p.x),
  y: useSharedValue(p.y)
}))
```

---

### ✅ DO: Batch Updates

```typescript
// ✅ GOOD: Single render trigger after all updates
useFrameCallback(() => {
  'worklet'
  for (let i = 0; i < particles.value.length; i++) {
    updateParticle(particles.value[i])
  }
  renderTrigger.value += 1 // Single re-render
})
```

```typescript
// ❌ BAD: Triggers re-render for each particle
for (let i = 0; i < particles.length; i++) {
  particles[i].x.value += 1 // Re-render!
  particles[i].y.value += 1 // Re-render!
}
```

---

### ✅ DO: Use useDerivedValue for Complex Calculations

```typescript
// ✅ GOOD: Calculation runs on UI thread
const color = useDerivedValue(() => {
  return interpolateColor(
    progress.value,
    [0, 1],
    ['#FF0000', '#00FF00']
  )
}, [progress])

<Circle color={color} />
```

```typescript
// ❌ BAD: Calculation on JS thread, requires runOnJS
const [color, setColor] = useState('#FF0000')

useAnimatedReaction(
  () => progress.value,
  (value) => {
    runOnJS(setColor)(/* calculation */)
  }
)
```

---

### ✅ DO: Minimize useDerivedValue Dependencies

```typescript
// ✅ GOOD: Only re-computes when necessary
const transform = useDerivedValue(() => {
  return [
    { translateX: x.value },
    { translateY: y.value }
  ]
}, [x, y]) // Only x and y
```

```typescript
// ❌ BAD: Re-computes on every render
const transform = useDerivedValue(() => {
  return [
    { translateX: x.value },
    { translateY: y.value }
  ]
  // Missing dependencies - recomputes unnecessarily
})
```

---

## Common Pitfalls

### ❌ PITFALL 1: Using makeMutable Without Render Trigger

```typescript
// ❌ BAD: Changes won't trigger re-renders
const particles = makeMutable([{ x: 0, y: 0 }])

gesture.onChange(() => {
  particles.value[0].x = 100 // Skia won't update!
})
```

```typescript
// ✅ GOOD: Use render trigger
const particles = makeMutable([{ x: 0, y: 0 }])
const renderTrigger = useSharedValue(0)

gesture.onChange(() => {
  particles.value[0].x = 100
  renderTrigger.value += 1 // Forces re-render
})
```

---

### ❌ PITFALL 2: Calling Hooks in Loops

```typescript
// ❌ BAD: React hooks can't be called in loops
return (
  <Canvas>
    {particles.map((p, i) => {
      const transform = useDerivedValue(() => /* ... */) // ERROR!
      return <Group transform={transform}>...</Group>
    })}
  </Canvas>
)
```

```typescript
// ✅ GOOD: Extract to separate component
function ParticleItem({ particle, renderTrigger }) {
  const transform = useDerivedValue(() => /* ... */) // ✅ OK
  return <Group transform={transform}>...</Group>
}

return (
  <Canvas>
    {particles.map((p, i) => (
      <ParticleItem key={i} particle={p} renderTrigger={renderTrigger} />
    ))}
  </Canvas>
)
```

---

### ❌ PITFALL 3: Forgetting 'worklet' Directive

```typescript
// ❌ BAD: Function runs on JS thread (slow!)
const gesture = Gesture.Pan().onChange((event) => {
  particles.value[0].x = event.x // Might not work correctly
})
```

```typescript
// ✅ GOOD: Runs on UI thread (fast!)
const gesture = Gesture.Pan().onChange((event) => {
  'worklet'
  particles.value[0].x = event.x // ✅ Runs on UI thread
})
```

---

### ❌ PITFALL 4: Mutating Shared Array Reference

```typescript
// ❌ BAD: Changing array reference doesn't notify dependents
const particles = makeMutable([{ x: 0 }])

useDerivedValue(() => {
  return particles.value.map(p => p.x) // Won't update when particles change!
}, [particles])
```

```typescript
// ✅ GOOD: Use render trigger to force updates
const particles = makeMutable([{ x: 0 }])
const renderTrigger = useSharedValue(0)

useDerivedValue(() => {
  const _trigger = renderTrigger.value // Force dependency
  return particles.value.map(p => p.x) // ✅ Updates when trigger changes
}, [particles, renderTrigger])
```

---

### ❌ PITFALL 5: Using Wrong Gesture API

```typescript
// ❌ BAD: Old API (removed in Reanimated 4.x)
import { PanGestureHandler, useAnimatedGestureHandler } from 'react-native-gesture-handler'

const gestureHandler = useAnimatedGestureHandler({
  onActive: (event) => { /* ... */ } // REMOVED!
})

<PanGestureHandler onGestureEvent={gestureHandler}>
  <Canvas />
</PanGestureHandler>
```

```typescript
// ✅ GOOD: New Gesture API (Reanimated 4.x)
import { Gesture, GestureDetector } from 'react-native-gesture-handler'

const gesture = Gesture.Pan()
  .onUpdate((event) => { /* ... */ }) // ✅ Use onUpdate, not onActive
  .onEnd(() => { /* ... */ })

<GestureDetector gesture={gesture}>
  <Canvas />
</GestureDetector>
```

---

## Real-World Examples

### Example 1: Pixelated Image Effect (This Project)

**Use Case**: 100+ particles that respond to touch gestures and spring back.

**Implementation**:
```typescript
// hooks/usePixelatedEffect.ts
export function usePixelatedEffect() {
  // Efficient storage for 100+ particles
  const particlesShared = makeMutable<IParticle[]>([])

  // Single reactive trigger
  const renderTrigger = useSharedValue(0)

  // Gesture updates particles
  const gesture = Gesture.Pan().onChange((event) => {
    'worklet'
    const currentParticles = particlesShared.value

    for (let i = 0; i < currentParticles.length; i++) {
      const particle = currentParticles[i]
      const dx = event.x - particle.x
      const dy = event.y - particle.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < minPushDistance) {
        const angle = Math.atan2(dy, dx)
        particle.vx -= Math.cos(angle) * force
        particle.vy -= Math.sin(angle) * force
      }
    }

    renderTrigger.value += 1
  })

  return { particlesShared, renderTrigger, gesture }
}

// components/ParticleCanvas.tsx
export default function ParticleCanvas() {
  const { particlesShared, renderTrigger, gesture } = usePixelatedEffect()

  // Physics loop
  useFrameCallback(() => {
    'worklet'
    const particles = particlesShared.value

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]

      // Spring back to original position
      p.x += (p.savedX - p.x) * 0.88
      p.y += (p.savedY - p.y) * 0.88

      // Apply friction
      p.vx *= 0.88
      p.vy *= 0.88

      // Update position
      p.x += p.vx
      p.y += p.vy
    }

    renderTrigger.value += 1
  })

  return (
    <GestureDetector gesture={gesture}>
      <Canvas>
        <ParticleRenderer
          particles={initialParticles}
          particlesShared={particlesShared}
          renderTrigger={renderTrigger}
        />
      </Canvas>
    </GestureDetector>
  )
}

// components/ParticleRenderer.tsx
function ParticleItem({ index, particlesShared, renderTrigger }) {
  const transform = useDerivedValue(() => {
    const _trigger = renderTrigger.value // Force update
    const particle = particlesShared.value[index]
    return [
      { translateX: particle.x },
      { translateY: particle.y }
    ]
  }, [index, particlesShared, renderTrigger])

  return (
    <Group transform={transform}>
      <Picture picture={particle.picture} />
    </Group>
  )
}
```

**Key Learnings**:
- ✅ `makeMutable` for efficient particle storage
- ✅ Single `renderTrigger` for all particles
- ✅ `useDerivedValue` bridges makeMutable and Skia reactivity
- ✅ `useFrameCallback` for smooth physics updates

---

### Example 2: Simple Draggable Shape

**Use Case**: Drag a shape around the screen.

```typescript
function DraggableRect() {
  const x = useSharedValue(100)
  const y = useSharedValue(100)

  const gesture = Gesture.Pan()
    .onChange((event) => {
      'worklet'
      x.value += event.changeX
      y.value += event.changeY
    })

  return (
    <GestureDetector gesture={gesture}>
      <Canvas style={{ flex: 1 }}>
        <Rect x={x} y={y} width={100} height={100} color="blue" />
      </Canvas>
    </GestureDetector>
  )
}
```

---

### Example 3: Animated Gradient

**Use Case**: Smooth color transitions.

```typescript
import { interpolateColors } from '@shopify/react-native-skia'

function AnimatedGradient() {
  const progress = useSharedValue(0)

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 2000 }),
      -1,
      true
    )
  }, [])

  const colors = useDerivedValue(() => {
    return interpolateColors(
      progress.value,
      [0, 0.5, 1],
      ['#FF0000', '#00FF00', '#0000FF']
    )
  }, [progress])

  return (
    <Canvas>
      <Rect x={0} y={0} width={300} height={500}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 500 }}
          colors={colors}
        />
      </Rect>
    </Canvas>
  )
}
```

---

## Quick Reference

### When to Use What

| Use Case | Solution | Example |
|----------|----------|---------|
| Single animated value | `useSharedValue` | Moving circle |
| Complex calculation | `useDerivedValue` | Color interpolation |
| Large dataset (100+) | `makeMutable` + trigger | Particle system |
| Continuous updates | `useFrameCallback` | Physics loop |
| Gesture interaction | `Gesture.Pan()` | Draggable objects |
| Color transitions | `interpolateColors` | Gradient animation |

---

### API Cheat Sheet

```typescript
// Reactive value (triggers re-renders)
const x = useSharedValue(0)

// Non-reactive storage (efficient)
const data = makeMutable({ x: 0, y: 0 })

// Computed value
const computed = useDerivedValue(() => x.value * 2, [x])

// Animation loop
useFrameCallback(() => {
  'worklet'
  x.value += 1
})

// Gesture
const gesture = Gesture.Pan()
  .onStart(() => { 'worklet' /* ... */ })
  .onChange((e) => { 'worklet' /* ... */ })
  .onEnd(() => { 'worklet' /* ... */ })

// Render
<GestureDetector gesture={gesture}>
  <Canvas>
    <Circle cx={x} cy={y} r={20} color="red" />
  </Canvas>
</GestureDetector>
```

---

## Summary

### ✅ Best Practices

1. **Use `useSharedValue` for reactive properties** that Skia needs to track
2. **Use `makeMutable` for bulk data** with a render trigger
3. **Always add 'worklet' directive** in gesture handlers and frame callbacks
4. **Extract components** when using hooks in map/loops
5. **Batch updates** with a single render trigger
6. **Use `useDerivedValue`** for complex calculations
7. **Use new Gesture API** (`.onChange()`, not `.onActive()`)

### ❌ Avoid

1. ❌ Using `makeMutable` without a render trigger
2. ❌ Calling hooks inside loops
3. ❌ Forgetting 'worklet' directive
4. ❌ Creating excessive shared values (100+)
5. ❌ Using old gesture handler API
6. ❌ Mutating array references without triggers

---

## Additional Resources

- **Skia Docs**: https://shopify.github.io/react-native-skia/
- **Reanimated Docs**: https://docs.swmansion.com/react-native-reanimated/
- **Gesture Handler**: https://docs.swmansion.com/react-native-gesture-handler/

---

**Last Updated**: 2025-09-30
**Project**: Dream Pie - Pixelated Effect Implementation