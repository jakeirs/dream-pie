# React Native Skia + Reanimated Integration Guide

## Project Versions

- **@shopify/react-native-skia**: 2.2.12
- **react-native-reanimated**: 4.1.0
- **react-native-gesture-handler**: 2.28.0

## Table of Contents

1. [Core Concepts](#core-concepts)
2. [useSharedValue - The Foundation](#usesharedvalue---the-foundation)
3. [The .modify() Method for Arrays](#the-modify-method-for-arrays)
4. [makeMutable (Discouraged)](#makemutable-discouraged)
5. [Animation Patterns](#animation-patterns)
6. [Gesture Integration](#gesture-integration)
7. [Performance Optimization](#performance-optimization)
8. [Common Pitfalls](#common-pitfalls)
9. [Real-World Examples](#real-world-examples)

---

## Core Concepts

### How Skia + Reanimated Work Together

**✅ KEY PRINCIPLE**: Skia components automatically track and react to Reanimated shared values.

```typescript
import { Canvas, Circle } from '@shopify/react-native-skia'
import { useSharedValue, withTiming } from 'react-native-reanimated'
import { useEffect } from 'react'

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
- Manual re-render triggers (when using `.modify()` correctly)

---

## useSharedValue - The Foundation

### Basic Usage

**When to use**: For any value that needs to trigger Skia re-renders.

```typescript
import { useSharedValue } from 'react-native-reanimated'

// ✅ Creates a reactive value that Skia tracks
const x = useSharedValue(0)

// Simple value updates
x.value = 100

// Animated updates
x.value = withSpring(100)

// Skia components will automatically re-render
<Group transform={[{ translateX: x }]}>
  <Circle cx={50} cy={50} r={20} color="red" />
</Group>
```

**Characteristics**:

- ✅ Triggers Skia re-renders automatically
- ✅ Works with `useDerivedValue`
- ✅ Integrates seamlessly with gesture handlers
- ✅ Automatic cleanup on component unmount
- ✅ **One shared value with large array is efficient** (using `.modify()`)

---

### React Compiler Compatibility

When working with React Compiler, use `.get()` and `.set()` methods instead of `.value`:

```typescript
function App() {
  const sv = useSharedValue(100)

  const animatedStyle = useAnimatedStyle(() => {
    'worklet'
    return { width: sv.get() * 100 } // ✅ Use .get() instead of .value
  })

  const handlePress = () => {
    sv.set((value) => value + 1) // ✅ Use .set() instead of .value =
  }
}
```

---

## The .modify() Method for Arrays

### Why .modify() is Essential

From official Reanimated documentation:

> **"When storing large arrays or complex objects in a shared value, you can use .modify method to alter the existing value instead of creating a new one."**

### The Problem with Direct Mutation

```typescript
// ❌ BAD: Direct property mutation loses reactivity
const particles = useSharedValue([{ x: 0, y: 0 }])

particles.value[0].x = 100 // Reanimated loses reactivity! 🚨
```

```typescript
// ⚠️ WORKS BUT INEFFICIENT: Creates new array copy
const particles = useSharedValue([{ x: 0, y: 0 }])

particles.value = [...particles.value] // Creates copy, memory overhead
particles.value[0].x = 100
```

### The Correct Way: .modify()

```typescript
// ✅ GOOD: Use .modify() for in-place mutations
const particles = useSharedValue([{ x: 0, y: 0 }])

particles.modify((array) => {
  'worklet'
  array[0].x = 100 // ✅ Safe mutation inside .modify()
  return array
})
```

---

### .modify() Syntax

```typescript
interface SharedValue<T> {
  modify: (modifier: (value: T) => T, forceUpdate?: boolean) => void
}

// Usage
sharedValue.modify((currentValue) => {
  'worklet'
  // Mutate currentValue in-place
  currentValue.property = newValue
  return currentValue // Must return the modified value
})
```

**Key Points**:

- ✅ Must include `'worklet'` directive
- ✅ Must return the modified value
- ✅ Maintains reactivity for array/object mutations
- ✅ No array copying overhead
- ✅ Thread-safe updates

---

### Practical Example: Updating 100+ Particles

```typescript
function ParticleSystem() {
  const particles = useSharedValue<Particle[]>([])

  const gesture = Gesture.Pan().onChange((event) => {
    // ✅ CORRECT: Use .modify() for array mutations
    particles.modify((particleArray) => {
      'worklet'

      for (let i = 0; i < particleArray.length; i++) {
        const particle = particleArray[i]
        const dx = event.x - particle.x
        const dy = event.y - particle.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < 100) {
          particle.vx -= dx * 0.1
          particle.vy -= dy * 0.1
        }
      }

      return particleArray
    })
  })
}
```

---

## makeMutable (Discouraged)

### ⚠️ WARNING: Avoid Unless You Know What You're Doing

From official Reanimated documentation:

> **"The usage of makeMutable is discouraged in most cases. It's recommended to use the useSharedValue hook instead unless you know what you're doing and you are aware of the consequences."**

### Why makeMutable is Problematic

```typescript
// ❌ BAD: makeMutable in component scope
function App() {
  const mv = makeMutable(100) // 🚨 Creates NEW object on every render!

  // State is lost on component re-render
}
```

### If You Must Use makeMutable

**Requirements**:

1. Wrap in `useMemo` to prevent re-creation
2. Manual cleanup with `cancelAnimation`
3. Cannot be used directly in component scope

```typescript
import { makeMutable, useMemo, useEffect, cancelAnimation } from 'react-native-reanimated'

function App() {
  // ✅ CORRECT: Wrap in useMemo
  const mv = useMemo(() => makeMutable(0), [])

  useEffect(() => {
    mv.value = withRepeat(withSpring(100), -1, true)

    return () => {
      // ✅ REQUIRED: Manual cleanup
      cancelAnimation(mv)
    }
  }, [])
}
```

### Comparison: makeMutable vs useSharedValue

| Feature                    | makeMutable                     | useSharedValue                  |
| -------------------------- | ------------------------------- | ------------------------------- |
| Component scope            | ❌ Needs useMemo                | ✅ Safe to use directly         |
| Reuses object on re-render | ❌ No (without useMemo)         | ✅ Yes                          |
| Auto cleanup               | ❌ Manual required              | ✅ Automatic                    |
| Initial value changes      | ❌ Creates new object           | ✅ Ignores changes              |
| Can use in loops           | ✅ Yes (if iterations constant) | ✅ Yes (if iterations constant) |

### Recommended: Use useSharedValue Instead

```typescript
// ❌ DON'T DO THIS
const particles = makeMutable<Particle[]>([])

// ✅ DO THIS INSTEAD
const particles = useSharedValue<Particle[]>([])

// Use .modify() for array mutations
particles.modify((arr) => {
  'worklet'
  arr[0].x = 100
  return arr
})
```

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
  })

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
A function passed to the callback argument is automatically workletized and ran on the UI thread.

**Arguments**

1. `callback`
   A function executed on every frame update. This function receives a frameInfo object containing the following fields:

- `timestamp` a number indicating the system time (in milliseconds) when the last frame was rendered.
- `timeSincePreviousFrame` a number indicating the time (in milliseconds) since last frame. This value will be null on the first frame after activation. Starting from the second frame, it should be ~16 ms on 60 Hz, and ~8 ms on 120 Hz displays (provided there are no frame dropped).
- `timeSinceFirstFrame` a number indicating the time (in milliseconds) since the callback was activated.

2. `autostart` (Optional)
   Whether the callback should start automatically. Defaults to true.

**Returns**

`useFrameCallback` returns an object containing these fields:

- `setActive` a function that lets you start the frame callback or stop it from running
- `isActive` a boolean indicating whether a callback is running
- `callbackId` a number indicating a unique identifier of the frame callback

```typescript
function PhysicsSimulation() {
  const particles = useSharedValue([
    { x: 100, y: 100, vx: 2, vy: 1 }
  ])

  useFrameCallback(() => {
    'worklet'

    particles.modify((particleArray) => {
      'worklet'
      const p = particleArray[0]

      // Update physics
      p.x += p.vx
      p.y += p.vy

      // Bounce off walls
      if (p.x > 300 || p.x < 0) p.vx *= -1
      if (p.y > 500 || p.y < 0) p.vy *= -1

      return particleArray
    })
  })

  const transform = useDerivedValue(() => {
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

### Advanced Gesture Pattern (Multiple Objects with .modify())

```typescript
function InteractiveParticles() {
  const particles = useSharedValue([
    { x: 100, y: 100, vx: 0, vy: 0 },
    { x: 200, y: 150, vx: 0, vy: 0 },
    // ... more particles
  ])

  const gesture = Gesture.Pan().onChange((event) => {
    particles.modify((particleArray) => {
      'worklet'
      const touchX = event.x
      const touchY = event.y
      const pushDistance = 100

      // Update all particles based on touch position
      for (let i = 0; i < particleArray.length; i++) {
        const particle = particleArray[i]
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

      return particleArray
    })
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
      scale.value = withSpring(1.1)
    })
    .onChange((event) => {
      x.value += event.changeX
    })
    .onEnd(() => {
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

### ✅ DO: Use useSharedValue with .modify() for Large Arrays

```typescript
// ✅ GOOD: Efficient for 1000+ particles
const particles = useSharedValue<Particle[]>(initialParticles)

particles.modify((arr) => {
  'worklet'
  for (let i = 0; i < arr.length; i++) {
    arr[i].x += 1
  }
  return arr
})
```

```typescript
// ❌ BAD: Creates 1000+ individual shared values
const particles = initialParticles.map((p) => ({
  x: useSharedValue(p.x),
  y: useSharedValue(p.y),
}))
```

---

### ✅ DO: Batch Updates with .modify()

```typescript
// ✅ GOOD: Single update with .modify()
useFrameCallback(() => {
  'worklet'

  particles.modify((arr) => {
    'worklet'
    for (let i = 0; i < arr.length; i++) {
      updateParticle(arr[i])
    }
    return arr
  })
})
```

```typescript
// ❌ BAD: Multiple individual shared values (causes many re-renders)
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
})

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

## Reanimated Dependencies - Critical Mobile Rules

### 🚨 CRITICAL: SharedValues in React Hook Dependencies

**Rule 1: Never use sharedValues in React hook dependency arrays**

SharedValues **do not trigger React re-renders** when their `.value` changes. Including them in `useEffect`, `useMemo`, or `useCallback` dependencies is an antipattern.

```typescript
// ❌ BAD: sharedValue in useEffect dependencies (won't work)
const x = useSharedValue(0)
const y = useSharedValue(100)

useEffect(() => {
  console.log('x changed:', x.value)
}, [x]) // ❌ Never triggers when x.value changes!
```

```typescript
// ✅ GOOD: Use useAnimatedReaction for sharedValue changes
const x = useSharedValue(0)

useAnimatedReaction(
  () => x.value,
  (currentValue, previousValue) => {
    console.log('x changed from', previousValue, 'to', currentValue)
  }
)
```

**Why this matters:**
- SharedValues are **worklet-based** (UI thread)
- React hooks are **JS thread** based
- `.value` changes don't trigger React's reconciliation
- Use `useAnimatedReaction` to bridge UI thread → JS thread

---

### 🚨 Dependency Arrays in Reanimated Hooks (Mobile vs Web)

**Rule 2: Dependency arrays behave differently on mobile vs web**

| Platform | Behavior | Dependencies Needed? |
|----------|----------|---------------------|
| **Mobile (iOS/Android)** | Auto-tracks all accessed sharedValues | ❌ No (optional for clarity) |
| **Web** | Manual tracking like React's useMemo | ✅ Yes (required) |

**For Mobile-Only Apps:**
```typescript
// ✅ MOBILE BEST PRACTICE: Omit dependency array (auto-tracking)
const transform = useDerivedValue(() => {
  return [
    { translateX: x.value },
    { translateY: y.value }
  ]
}) // Automatically tracks x, y on mobile
```

**For Cross-Platform (Mobile + Web):**
```typescript
// ✅ CROSS-PLATFORM: Include dependencies for web compatibility
const transform = useDerivedValue(() => {
  return [
    { translateX: x.value },
    { translateY: y.value }
  ]
}, [x, y]) // Required for web, optional on mobile
```

**Recommendation:**
- **Mobile-only projects**: Omit dependency arrays for cleaner code
- **Web support needed**: Include dependency arrays
- **Team preference**: Pick one style and stay consistent

---

### 🚨 Common Mistakes with Dependencies

**Mistake 1: Expecting React hooks to react to sharedValues**
```typescript
// ❌ BAD: useMemo won't update when x.value changes
const x = useSharedValue(0)
const doubled = useMemo(() => x.value * 2, [x])
```

```typescript
// ✅ GOOD: Use useDerivedValue for computed sharedValues
const x = useSharedValue(0)
const doubled = useDerivedValue(() => x.value * 2)
```

**Mistake 2: Using regular state when sharedValue is needed**
```typescript
// ❌ BAD: React state causes JS thread bottleneck
const [x, setX] = useState(0)
const gesture = Gesture.Pan().onChange((e) => {
  runOnJS(setX)(e.x) // Slow: UI → JS thread bridge
})
```

```typescript
// ✅ GOOD: sharedValue stays on UI thread
const x = useSharedValue(0)
const gesture = Gesture.Pan().onChange((e) => {
  x.value = e.x // Fast: UI thread only
})
```

---

## Common Pitfalls

### ❌ PITFALL 1: Direct Property Mutation Without .modify()

```typescript
// ❌ BAD: Direct mutation loses reactivity
const particles = useSharedValue([{ x: 0, y: 0 }])

particles.value[0].x = 100 // Reanimated loses reactivity! 🚨
```

```typescript
// ✅ GOOD: Use .modify() for mutations
const particles = useSharedValue([{ x: 0, y: 0 }])

particles.modify((arr) => {
  'worklet'
  arr[0].x = 100
  return arr
})
```

---

### ❌ PITFALL 2: Using makeMutable in Component Scope

```typescript
// ❌ BAD: Creates new object on every render
function App() {
  const mv = makeMutable(100) // 🚨 State lost on re-render!
}
```

```typescript
// ✅ GOOD: Use useSharedValue instead
function App() {
  const sv = useSharedValue(100) // ✅ Persists across renders
}
```

---

### ❌ PITFALL 3: Calling Hooks in Loops

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

### ❌ PITFALL 4: Forgetting 'worklet' Directive in .modify()

**Note**: Gesture callbacks (`.onChange()`, `.onStart()`, `.onEnd()`) are automatically workletized - you don't need `'worklet'` there. However, `.modify()` callbacks still require the `'worklet'` directive.

```typescript
// ❌ BAD: Missing 'worklet' inside .modify()
const gesture = Gesture.Pan().onChange((event) => {
  particles.modify((arr) => {
    arr[0].x = event.x // Missing 'worklet' - might not work correctly
    return arr
  })
})
```

```typescript
// ✅ GOOD: 'worklet' inside .modify() ensures UI thread execution
const gesture = Gesture.Pan().onChange((event) => {
  particles.modify((arr) => {
    'worklet'
    arr[0].x = event.x // ✅ Runs on UI thread
    return arr
  })
})
```

---

### ❌ PITFALL 5: Array Spreading Instead of .modify()

```typescript
// ⚠️ WORKS BUT INEFFICIENT: Creates new array on every update
const particles = useSharedValue([{ x: 0 }])

particles.value = [...particles.value] // Memory overhead!
particles.value[0].x = 100
```

```typescript
// ✅ GOOD: In-place mutation with .modify()
const particles = useSharedValue([{ x: 0 }])

particles.modify((arr) => {
  'worklet'
  arr[0].x = 100
  return arr
}) // No array copying!
```

---

### ❌ PITFALL 6: Using Wrong Gesture API

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
  .onChange((event) => { /* ... */ }) // ✅ Use onChange
  .onEnd(() => { /* ... */ })

<GestureDetector gesture={gesture}>
  <Canvas />
</GestureDetector>
```

---

## Real-World Examples

### Example 1: Pixelated Image Effect (This Project)

**Use Case**: 100+ particles that respond to touch gestures and spring back.

**CORRECT Implementation** (After learning official docs):

```typescript
// hooks/usePixelatedEffect.ts
export function usePixelatedEffect() {
  // ✅ Use useSharedValue (NOT makeMutable)
  const particlesShared = useSharedValue<IParticle[]>([])

  // Gesture updates particles
  const gesture = Gesture.Pan().onChange((event) => {
    // ✅ Use .modify() for array mutations
    particlesShared.modify((particles) => {
      'worklet'

      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i]
        const dx = event.x - particle.x
        const dy = event.y - particle.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < minPushDistance) {
          const angle = Math.atan2(dy, dx)
          const tx = particle.x + Math.cos(angle) * minPushDistance
          const ty = particle.y + Math.sin(angle) * minPushDistance
          const ax = tx - event.x
          const ay = ty - event.y
          particle.vx -= ax
          particle.vy -= ay
        }
      }

      return particles // Must return
    })
  })

  return { particlesShared, gesture }
}

// components/ParticleCanvas.tsx
export default function ParticleCanvas() {
  const { particlesShared, gesture } = usePixelatedEffect()

  // Physics loop
  useFrameCallback(() => {
    'worklet'

    // ✅ Use .modify() for physics updates
    particlesShared.modify((particles) => {
      'worklet'

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

      return particles // Must return
    })
  })

  return (
    <GestureDetector gesture={gesture}>
      <Canvas>
        <ParticleRenderer particlesShared={particlesShared} />
      </Canvas>
    </GestureDetector>
  )
}

// components/ParticleRenderer.tsx
function ParticleRenderer({ particlesShared }) {
  // ✅ useDerivedValue auto-tracks particlesShared changes (no manual trigger needed)
  const picture = useDerivedValue(() => {
    const particles = particlesShared.value

    return createPicture((canvas) => {
      particles.forEach((particle) => {
        canvas.save()
        canvas.translate(particle.x, particle.y)
        // ... render particle
        canvas.restore()
      })
    })
  })

  return <Picture picture={picture} />
}
```

**Key Learnings**:

- ✅ `useSharedValue` instead of `makeMutable` (official recommendation)
- ✅ `.modify()` for all array mutations (maintains reactivity)
- ✅ No manual render triggers needed - `useDerivedValue` auto-tracks sharedValue changes
- ✅ `useDerivedValue` automatically re-renders Skia when dependencies change
- ✅ `useFrameCallback` for smooth physics updates
- ✅ Automatic cleanup (no manual cancelAnimation needed)

---

### Example 2: Simple Draggable Shape

**Use Case**: Drag a shape around the screen.

```typescript
function DraggableRect() {
  const x = useSharedValue(100)
  const y = useSharedValue(100)

  const gesture = Gesture.Pan()
    .onChange((event) => {
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
  })

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

| Use Case              | Solution                       | Example                  |
| --------------------- | ------------------------------ | ------------------------ |
| Single animated value | `useSharedValue`               | Moving circle            |
| Complex calculation   | `useDerivedValue`              | Color interpolation      |
| Large array (100+)    | `useSharedValue` + `.modify()` | Particle system          |
| Continuous updates    | `useFrameCallback`             | Physics loop             |
| Gesture interaction   | `Gesture.Pan()`                | Draggable objects        |
| Color transitions     | `interpolateColors`            | Gradient animation       |
| React Compiler        | `.get()` / `.set()`            | Compiler-compatible code |

---

### API Cheat Sheet

```typescript
// Reactive value (triggers re-renders)
const x = useSharedValue(0)
x.value = 100

// React Compiler compatible
x.set(100)
const value = x.get()

// Array mutations with .modify()
const arr = useSharedValue([1, 2, 3])
arr.modify((array) => {
  'worklet'
  array[0] = 100
  return array
})

// Computed value (mobile: auto-tracks x; web: add [x] for compatibility)
const computed = useDerivedValue(() => x.value * 2)

// Animation loop
useFrameCallback(() => {
  x.value += 1
})

// Gesture (callbacks automatically workletized)
const gesture = Gesture.Pan()
  .onStart(() => { /* ... */ })
  .onChange((e) => { /* ... */ })
  .onEnd(() => { /* ... */ })

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

1. **Always use `useSharedValue`** for reactive values (not `makeMutable`)
2. **Use `.modify()` for array/object mutations** to maintain reactivity
3. **Always add 'worklet' directive** in `.modify()` callbacks (gesture callbacks are auto-workletized)
4. **Extract components** when using hooks in map/loops
5. **Use `useDerivedValue`** for complex calculations on UI thread
6. **Use new Gesture API** (`.onChange()`, not `.onActive()`)
7. **Use `.get()` and `.set()`** when working with React Compiler
8. **Never put sharedValues in React hook dependencies** (`useEffect`, `useMemo`, `useCallback`)
9. **Use `useAnimatedReaction`** to respond to sharedValue changes
10. **Dependency arrays in `useDerivedValue`** are optional on mobile (auto-tracking), required on web

### ❌ Avoid

1. ❌ Using `makeMutable` in component scope (use `useSharedValue`)
2. ❌ Direct property mutation: `arr.value[i].x = 100` (use `.modify()`)
3. ❌ Array spreading for updates: `arr.value = [...arr.value]` (use `.modify()`)
4. ❌ Calling hooks inside loops
5. ❌ Forgetting 'worklet' directive inside `.modify()` callbacks
6. ❌ Creating excessive individual shared values (100+)
7. ❌ Using old gesture handler API
8. ❌ Using sharedValues in `useEffect`/`useMemo`/`useCallback` dependencies
9. ❌ Manual render triggers (e.g., `renderTrigger.value += 1`)
10. ❌ Expecting React hooks to react to `.value` changes

---

## Additional Resources

- **Skia Docs**: https://shopify.github.io/react-native-skia/
- **Reanimated Docs**: https://docs.swmansion.com/react-native-reanimated/
- **Gesture Handler**: https://docs.swmansion.com/react-native-gesture-handler/
- **useSharedValue API**: https://docs.swmansion.com/react-native-reanimated/docs/core/useSharedValue
- **makeMutable Warning**: https://docs.swmansion.com/react-native-reanimated/docs/advanced/makeMutable

---

**Last Updated**: 2025-10-01
**Project**: Dream Pie - Pixelated Effect Implementation
**Version**: 3.0 - Added critical mobile dependency rules, removed antipatterns (renderTrigger, sharedValues in React hooks)
