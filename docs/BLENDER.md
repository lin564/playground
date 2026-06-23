# Blender → your world: models, textures, and animation sequences

Everything you build in Blender reaches the world as a single **glTF 2.0 binary
(`.glb`)** file: geometry, materials/textures, and animation clips all travel
inside it. This guide covers exporting from Blender and wiring the result into
your Microverse world.

---

## 1. Model and texture in Blender

- Build your mesh as usual. Work roughly in **meters** — Microverse is a
  real-world-scale engine, and the player avatar is ~1.7 m tall. A "room" should
  be a few meters across, not a few hundred.
- **Apply transforms** before export: `Object ▸ Apply ▸ All Transforms`
  (or Ctrl+A). Un-applied scale/rotation is the #1 cause of models that load
  giant, tiny, or sideways.
- Textures: use an **Image Texture** node feeding the Principled BSDF. Keep it to
  standard PBR channels (base color, metallic/roughness, normal). You can paint
  textures in Blender, bake procedural materials to image textures, or use any
  image. Embedded textures travel inside the `.glb`.
- Orientation: Blender is Z-up, glTF is Y-up — the exporter handles this when you
  leave **+Y Up** checked (default).

## 2. Animation in Blender

- Create your motion as **Actions** (Dope Sheet ▸ Action Editor). Each Action
  becomes one **animation clip** in the `.glb`.
- For several sequences on one model (e.g. *idle*, *wave*, *open*), push each
  Action down as an **NLA strip** (Nonlinear Animation editor ▸ *Push Down*).
  Every strip exports as its own clip, in order.
- Name your actions clearly — the clip order (0, 1, 2, …) is what the world uses
  to pick a clip (`animationClipIndex`).
- Skeletal (armature) animation, shape keys, and object transform animation all
  export. Bake complex/constraint-driven rigs first
  (`Object ▸ Animation ▸ Bake Action`) if a clip looks wrong after export.

## 3. Export from Blender

`File ▸ Export ▸ glTF 2.0 (.glb/.gltf)`, then in the export panel:

| Setting | Value |
|---|---|
| **Format** | `glTF Binary (.glb)` |
| **Include** | check *Selected Objects* if you only want part of the scene |
| **Transform** | *+Y Up* ✔ |
| **Data ▸ Mesh** | *Apply Modifiers* ✔ |
| **Data ▸ Material** | *Export* (with images) |
| **Animation** | ✔ enable; also check *Animations*, and under it *NLA Strips* so every strip becomes a clip |
| **Animation ▸ Sampling / Optimize** | leave defaults; enable *Bake All Actions* if clips are missing |

Save it as something like `my-model.glb`.

## 4. Put it in the world

**Quick way — drag and drop (no code):**
Drag the `.glb` from your file manager onto the running world in the browser. It
appears as a card where you dropped it and **auto-plays its first animation clip,
looped and synchronized for everyone**. Great for iterating.

**Permanent way — a card in `worlds/default.js`:**
Copy your file into `./assets/` and add a card (there's a commented template at
the bottom of `worlds/default.js`):

```js
{
    card: {
        name: "my animated model",
        type: "3d",
        modelType: "glb",
        dataLocation: "./assets/my-model.glb",
        layers: ["pointer"],            // needed for click-to-switch-clip
        behaviorModules: ["Animation"], // see behaviors/default/animation.js
        translation: [0, 0, -6],
        scale: [1, 1, 1],
        shadow: true,
    }
}
```

- **Walkable environment?** Use `layers: ["walk"]` instead of `["pointer"]` and
  the player can walk on/through its collision geometry. (Use both —
  `["walk", "pointer"]` — to walk on it *and* click it.)
- **Just decoration?** `layers: ["pointer"]` (clickable) or omit for static.

## 5. Animation playback & control

- **Auto-loop:** any animated `.glb` plays clip 0 on load, looped, with playback
  time derived from the synchronized session clock — identical for every user.
- **Click to switch clips:** add `behaviorModules: ["Animation"]` and
  `layers: ["pointer"]`. Tapping the model steps clip 0 → 1 → … → last → *paused*
  → 0. A one-clip model becomes a click play/pause toggle. The change is synced,
  so one person's click changes the clip for everyone.
- **Pick a starting clip:** set `animationClipIndex: <n>` on the card.
- **Switch clips from your own code:** from a behavior, call
  `this.say("setAnimationClipIndex", n)` (`n = -1` pauses).

## 6. Don't have a model yet? Test the pipeline fast

Any animated `.glb` works. Quick options:
- In Blender: add a Cube, insert a couple of rotation keyframes
  (`I ▸ Rotation`), export as `.glb`, drag it into the world — it spins, synced.
- Or drop in any royalty-free animated glTF (e.g. the Khronos glTF sample assets)
  to confirm playback before committing to your own art.

---

### Troubleshooting

| Symptom | Fix |
|---|---|
| Model loads huge/tiny/rotated | `Apply ▸ All Transforms` in Blender, re-export |
| No animation plays | Re-export with *Animation* ✔ and *NLA Strips* ✔; try *Bake All Actions* |
| Only one of several clips plays | Each must be its own NLA strip; clip 0 auto-plays — add the `Animation` behavior to step through the rest |
| Clicking does nothing | Card needs `layers: ["pointer"]` and `behaviorModules: ["Animation"]` |
| Textures missing/black | Export with materials + images; use an Image Texture node into Principled BSDF |
