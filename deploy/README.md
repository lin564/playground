# Deploying the world publicly

Goal: anyone with a link can open your world, walk around, and see each other —
with no dependency on any Croquet/Multisynq server. There are **two** things to
host:

| Part | What | Where |
|---|---|---|
| **Client** | the static world files (this repo: `index.html`, `lib/`, `worlds/`, `behaviors/`, `assets/`) | a static host (GitHub Pages / Cloudflare Pages) |
| **Reflector** | the Node sync server (`deploy/reflector/`) | a compute host that gives a **`wss://`** address (Fly.io / a VPS) |

> **Why the reflector needs `wss://` (not `ws://`):** the client is served over
> HTTPS, and browsers refuse to open an insecure `ws://` socket from an HTTPS
> page. The reflector container speaks plain `ws` on port 9090; the host edge
> (Fly.io, Caddy, nginx) terminates TLS and exposes `wss://` to the browser.

---

## Step 1 — Deploy the reflector

### Option A: Fly.io (recommended)

Fly terminates TLS and supports WebSockets out of the box.

```bash
# one-time: install flyctl and sign in
#   https://fly.io/docs/flyctl/install/
fly auth login

cd deploy/reflector
fly launch --no-deploy      # names the app + region, edits fly.toml
fly deploy                  # builds the Dockerfile and ships it
```

When it's up, your reflector is at:

```
wss://<your-app-name>.fly.dev
```

Sanity check it's alive (a plain GET returns 426 "Upgrade Required", which is
the correct response from a WebSocket server):

```bash
curl -i https://<your-app-name>.fly.dev/
```

### Option B: any VPS with Docker + Caddy (auto-TLS)

On a server with a domain pointed at it (e.g. `reflector.example.com`):

```bash
cd deploy/reflector
docker build -t my-reflector .
docker run -d --restart unless-stopped -p 9090:9090 --name reflector my-reflector
```

Put Caddy in front for automatic HTTPS/WSS (Caddy proxies WebSockets natively):

```
# /etc/caddy/Caddyfile
reflector.example.com {
    reverse_proxy 127.0.0.1:9090
}
```

Your reflector is then at `wss://reflector.example.com`.

> Render, Railway, and similar container hosts also work — point them at
> `deploy/reflector/Dockerfile`; they provide the `wss://` URL.

---

## Step 2 — Deploy the client (GitHub Pages)

This repo already has `.github/workflows/pages.yml`, which publishes the repo to
GitHub Pages on every push to `main`.

1. Merge this branch into `main` (or set the workflow to deploy your branch).
2. In the repo on GitHub: **Settings → Pages →** Source = "GitHub Actions".
3. The site goes live at:
   ```
   https://<your-user>.github.io/<repo>/
   ```
   (for this repo: `https://lin564.github.io/playground/`)

> Prefer Cloudflare Pages? Connect the repo there instead and set the build
> output to the repo root — the result is the same static site over HTTPS.

---

## Step 3 — Wire them together (the shareable link)

Append your reflector address as `?reflector=` and pick a session name with `q=`:

```
https://lin564.github.io/playground/?reflector=wss://<your-app-name>.fly.dev&q=main
```

- `?reflector=wss://...` points the client at **your** reflector. The client
  then uses `apiKey:"none"` / `signServer:"none"` — it never contacts any
  Croquet server.
- `&q=main` is the shared session name. **Everyone who opens this exact link
  lands in the same world and sees each other.** Change `main` to run separate
  rooms.

That single URL is what you share. Done.

---

## Notes / current limits

- **Persistence:** the reflector runs `--storage=none`, so a session lives in
  memory while at least one person is connected, and resets when everyone
  leaves. World *content* is not lost — it's defined in `worlds/default.js` +
  committed `assets/`, so it reloads identically every time. (To persist runtime
  changes across an empty world, add a snapshot file server — a follow-up.)
- **Runtime drag-and-drop model uploads** also need that file server (uploads
  are stored there). Until then, add models the durable way: commit the `.glb`
  under `assets/` and define a card in `worlds/default.js` (see the Blender
  pipeline in `behaviors/default/animation.js`). Committed models work perfectly
  on this deployment and load identically for everyone.
- **Dormancy** (the "2 → 1 visitor" you saw when testing many windows on one PC)
  is a non-issue in real use: each person's window is active on their own
  device, so nobody sleeps.
