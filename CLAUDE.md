# Ultisim Playground - Claude Code Instructions

## Project Overview

This is a **Croquet Microverse** project - a collaborative 3D virtual world built on the Croquet platform.

> **Self-hosted:** The hosted Croquet network was deprecated and Multisynq is shut
> down. This world runs fully standalone against a self-hosted reflector with no
> dependency on any Croquet/Multisynq server. See `docs/STANDALONE.md`.

## Tech Stack

- **Framework**: Croquet Microverse (`@croquet/microverse-library` v0.8.4)
- **Language**: JavaScript (ES Modules)
- **3D Engine**: Three.js (via Microverse)
- **Physics**: Rapier3D

## Project Structure

```
playground/
├── index.html          # Main entry point
├── apiKey.js           # Croquet API credentials (DO NOT COMMIT CHANGES)
├── package.json        # Dependencies and scripts
├── worlds/
│   └── default.js      # World configuration and default cards
├── behaviors/
│   ├── croquet/        # Built-in Croquet behaviors
│   └── default/        # Custom behaviors for this world
├── assets/             # 3D models, textures, CSS, fonts
└── lib/                # Bundled Microverse library files
```

## Development Commands

```bash
npm install       # Install dependencies
npm start         # Start dev server on port 9684
```

## Key Concepts

- **Cards**: 3D objects in the world (defined in `worlds/default.js`)
- **Behaviors**: Reusable modules that add interactivity to cards
- **Layers**: Collision/interaction categories (walk, pointer, light)

## Working with World Configuration

The main world is configured in `worlds/default.js`:
- `Constants.DefaultCards` - Array of card definitions
- `Constants.UserBehaviorModules` - Custom behavior modules to load
- `Constants.AvatarNames` - Available avatar models

## Important Notes

- The `apiKey.js` contains Croquet credentials - avoid committing changes to this file
- The `lib/` folder contains bundled dependencies - do not modify
- Behaviors in `behaviors/croquet/` are from the Microverse library
- Custom behaviors should go in `behaviors/default/`
