# Running this world fully standalone (no Croquet / Multisynq servers)

The hosted Croquet network was deprecated (July 30, 2025) and Multisynq is shut
down. **This world does not depend on either.** Every piece of the stack is open
source (Apache-2.0) and runs on hardware you control:

| Piece | What it is | Where it comes from |
|---|---|---|
| **Client** (this repo) | The 3D world: `index.html` + `lib/` + `worlds/` + `behaviors/` + `assets/` | `@croquet/microverse-library` (prebuilt, vendored into the repo) |
| **Reflector** | The synchronization server that keeps every user in lockstep | `croquet/croquet` → `packages/reflector` |
| **File server** | Serves the client and stores session snapshots | any static host (or the reflector's bundled one) |

## Why this is independent of any company's servers

When the client is told to use your own reflector, it stops contacting Croquet
entirely. From the client bundle (`getBackend`):

```js
if (u.box || u.reflector) return { apiKey: "none", signServer: "none", reflector: u.reflector };
```

`signServer: "none"` ⇒ it never calls `api.croquet.io`, and **no API key is
required**. The matching behavior on the reflector: with `--standalone` (and no
Google Cloud project) its `VERIFY_TOKEN` is `false`, so it never validates keys
against any server either. The Multisynq DePIN network (`api.multisynq.io`,
wallets, Synq keys) is only reached behind an opt-in `--depin` flag we never use.

## Run it locally

**1. Serve this world** (terminal 1):

```bash
npm install      # vendors lib/, assets, behaviors from microverse-library 0.8.4
npm start        # serves on http://localhost:9684
```

**2. Run your own reflector** (terminal 2):

```bash
git clone https://github.com/croquet/croquet.git
cd croquet/packages/reflector
npm install
npm start        # standalone reflector on ws://localhost:9090
```

> `npm start` here is literally `node reflector.js --standalone --storage=none
> --no-loglatency` — standalone mode, no external calls.

**3. Open the world pointed at your reflector:**

```
http://localhost:9684/?reflector=ws://localhost:9090
```

Open that same URL in a second tab (or send it to a friend) and you'll see a
second avatar — that's the multi-user sync running entirely on your machines.

### Alternative: Croquet-in-a-Box (reflector + web + file server in one)

For a single self-contained bundle (uses Docker + nginx), see
`croquet/server/croquet-in-a-box/` in the croquet repo. Once it's running at,
say, `https://your-box.example.com/`, point the client at everything at once:

```
http://localhost:9684/?box=https://your-box.example.com/
```

`?box=` sets both the reflector **and** the snapshot/asset file server in one go.

## Deploying for "anyone with the link"

1. **Host the static client** — this repo deploys to GitHub Pages via
   `.github/workflows/pages.yml` (push to `main`), or use Cloudflare Pages /
   Netlify / Vercel. This gives you the world's public URL.
2. **Host the reflector** — run `packages/reflector` (or Croquet-in-a-Box) on a
   small VM/container with a public **`wss://`** endpoint (TLS is required when
   the page is served over HTTPS).
3. **Wire them together** — share links as
   `https://your-world.example.com/?box=https://your-reflector.example.com/`, or
   bake the reflector into the app by exporting extra Croquet session parameters
   from `apiKey.js` so the plain URL just works.

## Notes

- **Snapshots / persistence:** a standalone reflector with `--storage=none` keeps
  the session live in memory but doesn't persist snapshots. For persistence,
  point it at a file server (Croquet-in-a-Box wires this up).
- **The lighting HDR** in `worlds/default.js` still loads from a Croquet-hosted
  `dataLocation` hash. If that CDN is gone, drop in a local `.jpg`/`.exr`
  environment map under `assets/` and update the `light` card's
  `dataLocation`/`fileName`. Lighting degrades gracefully if it can't load.
- **Uploading models & animations:** drag-and-drop a `.glb` into the running
  world; tag it `walk` to walk on it. glTF animations authored in Blender play
  via Microverse — see the `behaviors/` for examples.
