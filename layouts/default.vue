<template>
  <div class="min-h-screen bg-gray-900 text-white flex flex-col">
    <div class="container mx-auto px-4 py-8 flex-grow">
      <slot />
    </div>
    <footer class="bg-gray-800 py-4 text-center">
      <p class="text-white">Made with <span class="text-red-500">❤</span> by Chaotischer</p>
    </footer>
  </div>
</template>

<style>
body {
  margin: 0;
  padding: 0;
  background-color: #111827;
  color: #ffffff;
}
</style> 