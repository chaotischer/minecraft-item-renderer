import { ref } from 'vue'

// Composable for handling 3D item rendering with rotation and zoom controls
export function useItemRenderer() {
  // State for 3D rotation and zoom level
  const rotation = ref({ x: 0, y: 0 })
  const zoom = ref(4)
  const isDragging = ref(false)
  const previousMousePosition = ref({ x: 0, y: 0 })

  // Initiates drag interaction for rotation
  const startDrag = (event: MouseEvent) => {
    isDragging.value = true
    previousMousePosition.value = { x: event.clientX, y: event.clientY }
  }

  // Handles rotation during drag based on mouse movement
  const onDrag = (event: MouseEvent) => {
    if (!isDragging.value) return

    const deltaMove = {
      x: event.clientX - previousMousePosition.value.x,
      y: event.clientY - previousMousePosition.value.y
    }

    rotation.value.y += deltaMove.x * 0.5
    rotation.value.x -= deltaMove.y * 0.5
    previousMousePosition.value = { x: event.clientX, y: event.clientY }
  }

  // Ends drag interaction
  const stopDrag = () => isDragging.value = false

  // Handles zoom level changes via mouse wheel
  const onZoom = (event: WheelEvent) => {
    const zoomSpeed = 0.001
    zoom.value = Math.max(2, Math.min(5, zoom.value - event.deltaY * zoomSpeed))
  }

  // Resets view to default rotation and zoom
  const resetView = () => {
    rotation.value = { x: 0, y: 0 }
    zoom.value = 4
  }

  return {
    rotation,
    zoom,
    startDrag,
    onDrag,
    stopDrag,
    onZoom,
    resetView
  }
} 