# 🧱 Minecraft Item Renderer

A tool that renders Minecraft item textures (`.png`) as 3D-style models using Vue.js and TypeScript. This project allows you to view and interact with Minecraft items in 3D directly in your browser, with support for animated textures.

## 🔗 Demo

You can see a live demo of the project [here](https://render.chaotischer.de/).

## 🚀 Features

- **3D Rendering:** Converts Minecraft item textures into layered 3D models
- **Animation Support:** Handles vertical sprite sheets for animated textures
- **Multiple Animation Modes:** Loop, Reverse, and back and forth animations
- **Minecraft-style Timing:** Uses Minecraft's tick system (20 ticks = 1 second)
- **Interactive Controls:** Rotate, zoom, and reset view
- **Pixelated Rendering:** Maintains Minecraft's iconic visual style

## 🖼️ Preview

![Minecraft Item Renderer](.docs/preview.png)

## 🛠️ Installation

To build the project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/chaotischer/minecraft-item-renderer/
   cd minecraft-item-renderer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

## 🔧 Build

To build the project for production:

```bash
npm run build
```

Then, start the production server:

```bash
npm run start
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💖 Credits

- Made with ❤️ by Chaotischer

- The default animated textures shown when loading the page are from the ["Animated Items" resource pack](https://modrinth.com/resourcepack/animated-items) by vrabb-gh.
  - The following items from the resource pack may be included as default textures:
      - Breeze Rod
      - Golden Apple
      - Ominous Bottle
      - Salmon Bucket
  - Please respect the original resource pack's CC-BY-NC-4.0 license when using these textures. 