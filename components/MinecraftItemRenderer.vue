<template>
  <!-- File upload section -->
  <div class="text-white">
    <div class="upload-section">
      <input type="file" accept=".png" @change="handleFileUpload" class="hidden" ref="fileInput" />
      <button @click="triggerFileInput" class="bg-gray-700 hover:bg-gray-600 font-bold py-2 px-4 rounded">
        Upload Texture
      </button>
      <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
    </div>
    
    <!-- 3D renderer container with mouse interaction -->
    <div class="renderer-box mt-4 bg-gray-800 rounded-lg p-6 relative">
      <div class="renderer-container"
           @mousedown="startDrag"
           @mousemove="onDrag"
           @mouseup="stopDrag"
           @mouseleave="stopDrag"
           @wheel.prevent="onZoom">
        <!-- Item container with 3D transformation -->
        <div ref="itemContainer" 
             class="item-container"
             :style="{
               transform: `translate(-50%, -50%) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
               width: `${64 * zoom}px`,
               height: `${64 * zoom}px`
             }">
          <!-- Multiple layers for 3D depth effect -->
          <template v-if="imageUrl">
            <img v-for="depth in 16"
                 :key="depth"
                 :src="imageUrl" 
                 class="item-layer"
                 :style="{ 
                   transform: `translate(-50%, -50%) translateZ(${-(depth - 1) * 0.25 * zoom}px)`,
                   width: `${64 * zoom}px`,
                   height: `${64 * zoom}px`
                 }" />
          </template>
        </div>
      </div>
      <!-- Animation status display -->
      <div v-if="isAnimating" class="absolute bottom-2 right-2 text-sm bg-gray-900 bg-opacity-75 px-2 py-1 rounded flex gap-2">
        <span>{{ tickRate }} ticks ({{ (tickRate / 20).toFixed(2) }}s per frame)</span>
        <span class="border-l border-gray-600 pl-2">{{ animationMode }}</span>
      </div>
    </div>

    <!-- User tip for sprite sheets -->
    <p class="text-sm mt-4 text-gray-400">
      Tip: You can upload a sprite sheet for animated textures. The sprite sheet should contain frames of equal size arranged vertically.
    </p>

    <!-- Controls and keyboard shortcuts -->
    <div class="controls mt-4">
      <div class="bg-gray-800 rounded-lg p-4">
        <table class="w-full text-sm">
          <thead class="text-gray-400 border-b border-gray-700">
            <tr>
              <th class="pb-2 text-left">Action</th>
              <th class="pb-2 text-left">Key</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="py-2">Rotate item</td>
              <td><span class="key">Left Mouse Button</span></td>
            </tr>
            <tr>
              <td class="py-2">Zoom</td>
              <td><span class="key">Mouse Wheel</span></td>
            </tr>
            <tr>
              <td class="py-2">Reset position</td>
              <td><span class="key">R</span></td>
            </tr>
            <tr>
              <td class="py-2">Decrease animation speed</td>
              <td><span class="key">,</span></td>
            </tr>
            <tr>
              <td class="py-2">Increase animation speed</td>
              <td><span class="key">.</span></td>
            </tr>
            <tr>
              <td class="py-2">Change animation mode</td>
              <td>
                <span class="key">M</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import { useItemRenderer } from '~/composables/useItemRenderer'
import { useTextureUploader } from '~/composables/useTextureUploader'

// Initialize composables for item rendering and texture handling
const { rotation, zoom, startDrag, onDrag, stopDrag, onZoom, resetView } = useItemRenderer()
const { 
  fileInput, 
  error, 
  imageUrl, 
  isAnimating, 
  tickRate, 
  animationMode,
  triggerFileInput, 
  handleFileUpload, 
  adjustTickRate,
  cycleAnimationMode,
  loadRandomDefaultTexture
} = useTextureUploader()

// Set up keyboard event listeners and load default texture
onMounted(() => {
  window.addEventListener('keydown', handleKeyPress)
  loadRandomDefaultTexture()
})
onBeforeUnmount(() => window.removeEventListener('keydown', handleKeyPress))

// Handle keyboard shortcuts for various controls
const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key.toLowerCase() === 'r') resetView()
  if (event.key === ',') adjustTickRate(-1)
  if (event.key === '.') adjustTickRate(1)
  if (event.key.toLowerCase() === 'm') cycleAnimationMode()
}
</script>

<style scoped>
/* Styling for the renderer box */
.renderer-box { border: 1px solid rgba(255, 255, 255, 0.1); }

/* Container for 3D rendering with perspective */
.renderer-container {
  position: relative;
  width: 100%;
  height: 400px;
  cursor: grab;
  background: transparent;
  perspective: 1000px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  -webkit-user-select: none;
}

.renderer-container:active { cursor: grabbing; }

/* Container for the 3D item */
.item-container {
  position: absolute;
  left: 50%;
  top: 50%;
  transform-style: preserve-3d;
  transform-origin: center;
  user-select: none;
  -webkit-user-select: none;
}

/* Individual layers of the 3D item */
.item-layer {
  position: absolute;
  left: 50%;
  top: 50%;
  transform-origin: center;
  backface-visibility: visible;
  pointer-events: none;
  user-drag: none;
  -webkit-user-drag: none;
  user-select: none;
  -webkit-user-select: none;
  image-rendering: pixelated !important;
}

/* Styling for keyboard shortcut display */
.key {
  display: inline-block;
  padding: 2px 8px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.9em;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.2);
}

.upload-section { margin-bottom: 1rem; }
.hidden { display: none; }
</style> 