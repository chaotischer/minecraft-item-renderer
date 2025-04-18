import { ref } from 'vue'
import { useSpriteAnimation } from './useSpriteAnimation'

// Composable for handling texture uploads and default texture loading
export function useTextureUploader() {
  // References and state management
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

  // Loads a random default texture from the server
  const loadRandomDefaultTexture = async () => {
    try {
      const response = await fetch('/api/default-items')
      const items = await response.json()
      if (items.length > 0) {
        const randomItem = items[Math.floor(Math.random() * items.length)]
        const textureResponse = await fetch(`/default-items/${randomItem}`)
        const blob = await textureResponse.blob()
        const reader = new FileReader()
        reader.onload = async (e) => {
          const result = e.target?.result as string
          imageUrl.value = result
          await detectFrames(result)
        }
        reader.readAsDataURL(blob)
      }
    } catch (err) {
      console.error('Failed to load default texture:', err)
    }
  }

  // Triggers the hidden file input element
  const triggerFileInput = () => fileInput.value?.click()

  // Handles file upload and validation
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
    cycleAnimationMode,
    loadRandomDefaultTexture
  }
} 