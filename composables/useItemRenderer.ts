import { ref } from 'vue'
export function useItemRenderer() {
  const rotation = ref({ x: 0, y: 0 })
  const zoom = ref(4)
  const isDragging = ref(false)
  const previousMousePosition = ref({ x: 0, y: 0 })

  const startDrag = (event: MouseEvent) => {
    isDragging.value = true
    previousMousePosition.value = { x: event.clientX, y: event.clientY }
  }

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

  const stopDrag = () => isDragging.value = false

  const onZoom = (event: WheelEvent) => {
    const zoomSpeed = 0.001
    zoom.value = Math.max(2, Math.min(5, zoom.value - event.deltaY * zoomSpeed))
  }

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