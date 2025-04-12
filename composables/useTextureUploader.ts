import { ref } from 'vue'
import { useSpriteAnimation } from './useSpriteAnimation'

export function useTextureUploader() {
  const fileInput = ref<HTMLInputElement | null>(null)
  const error = ref('')
  const imageUrl = ref('')
  const { 
    detectFrames, 
    currentFrame, 
    isAnimating, 
    tickRate, 
    animationMode,
    adjustTickRate,
    cycleAnimationMode 
  } = useSpriteAnimation()

  const triggerFileInput = () => fileInput.value?.click()

  const handleFileUpload = async (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    
    if (!file) {
      error.value = 'No file selected'
      return
    }
    
    if (!file.type.includes('image/png')) {
      error.value = 'Please upload PNG files only'
      return
    }
    
    try {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const result = e.target?.result as string
        imageUrl.value = result
        error.value = ''
        await detectFrames(result)
      }
      reader.onerror = () => error.value = 'Error loading texture'
      reader.readAsDataURL(file)
    } catch (err) {
      error.value = 'Error loading texture'
      console.error(err)
    }
  }

  return {
    fileInput,
    error,
    imageUrl: currentFrame,
    isAnimating,
    tickRate,
    animationMode,
    triggerFileInput,
    handleFileUpload,
    adjustTickRate,
    cycleAnimationMode
  }
} 