import { ref, computed } from 'vue'

export type AnimationMode = 'loop' | 'reverse' | 'back and fourth'

export function useSpriteAnimation() {
  const spriteFrames = ref<string[]>([])
  const currentFrameIndex = ref(0)
  const isAnimating = ref(false)
  const animationInterval = ref<number | null>(null)
  const frameSize = ref({ width: 64, height: 64 })
  const tickRate = ref(2) // Default 2 ticks = 0.1s per frame (10 frames per second)
  const animationMode = ref<AnimationMode>('loop')
  const isReversed = ref(false)

  const detectFrames = async (imageUrl: string): Promise<void> => {
    return new Promise((resolve) => {
      stopAnimation()
      spriteFrames.value = []
      
      const img = new Image()
      img.onload = () => {
        const framesCount = Math.floor(img.height / img.width)
        if (framesCount <= 1) {
          spriteFrames.value = [imageUrl]
          resolve()
          return
        }

        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          spriteFrames.value = [imageUrl]
          resolve()
          return
        }

        frameSize.value = { width: img.width, height: img.width }
        canvas.width = img.width
        canvas.height = img.width

        for (let i = 0; i < framesCount; i++) {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          ctx.drawImage(img, 0, i * img.width * -1)
          spriteFrames.value.push(canvas.toDataURL('image/png'))
        }

        if (spriteFrames.value.length > 1) {
          startAnimation()
        }
        resolve()
      }
      img.src = imageUrl
    })
  }

  const updateFrame = () => {
    const lastIndex = spriteFrames.value.length - 1
    
    switch (animationMode.value) {
      case 'loop':
        currentFrameIndex.value = (currentFrameIndex.value + 1) % spriteFrames.value.length
        break
      case 'reverse':
        currentFrameIndex.value = currentFrameIndex.value === 0 
          ? lastIndex 
          : currentFrameIndex.value - 1
        break
      case 'back and fourth':
        if (isReversed.value) {
          currentFrameIndex.value--
          if (currentFrameIndex.value <= 0) {
            currentFrameIndex.value = 0
            isReversed.value = false
          }
        } else {
          currentFrameIndex.value++
          if (currentFrameIndex.value >= lastIndex) {
            currentFrameIndex.value = lastIndex
            isReversed.value = true
          }
        }
        break
    }
  }

  const startAnimation = () => {
    stopAnimation()
    if (spriteFrames.value.length <= 1) return
    
    isAnimating.value = true
    const msPerTick = 1000 / 20 // 1 tick = 50ms (20 ticks per second)
    animationInterval.value = window.setInterval(updateFrame, msPerTick * tickRate.value) // tickRate ticks per frame
  }

  const stopAnimation = () => {
    if (animationInterval.value) {
      clearInterval(animationInterval.value)
      animationInterval.value = null
    }
    isAnimating.value = false
    currentFrameIndex.value = 0
    isReversed.value = false
  }

  const adjustTickRate = (delta: number) => {
    tickRate.value = Math.max(1, Math.min(20, tickRate.value + delta))
    if (isAnimating.value) {
      startAnimation()
    }
  }

  const cycleAnimationMode = () => {
    const modes: AnimationMode[] = ['loop', 'reverse', 'back and fourth']
    const currentIndex = modes.indexOf(animationMode.value)
    animationMode.value = modes[(currentIndex + 1) % modes.length]
    if (isAnimating.value) {
      startAnimation()
    }
  }

  const currentFrame = computed(() => {
    return spriteFrames.value[currentFrameIndex.value] || spriteFrames.value[0]
  })

  return {
    detectFrames,
    currentFrame,
    isAnimating,
    tickRate,
    animationMode,
    startAnimation,
    stopAnimation,
    adjustTickRate,
    cycleAnimationMode
  }
} 