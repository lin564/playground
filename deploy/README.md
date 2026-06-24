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

### Option B: your own cloud VM with Docker + Caddy (no domain needed)

This uses **sslip.io** — a free wildcard DNS service where `203-0-113-5.sslip.io`
resolves to IP `203.0.113.5` — so Caddy can get a real Let's Encrypt cert from
just your VM's public IP. No domain registration, no DNS account.

On the VM (with Docker + the Docker Compose plugin):

```bash
# 1. Open ports 80 and 443 in the VM's firewall / cloud security group.

# 2. Find your VM's public IP, e.g. 203.0.113.5, and set the hostname
#    (dashes, not dots) in deploy/reflector/.env :
cd deploy/reflector
echo "REFLECTOR_HOSTNAME=203-0-113-5.sslip.io" > .env     # <-- your IP, dashed

# 3. Uncomment the `caddy` service in docker-compose.yml, then:
docker compose up -d
```

Caddy fetches the TLS cert automatically. Your reflector is then at:

```
wss://203-0-113-5.sslip.io       # <-- your dashed IP
```

Verify (426 "Upgrade Required" is the correct response from a WS server):

```bash
curl -i https://203-0-113-5.sslip.io/
```

> Got a real domain later? Point an A-record at the VM, set
> `REFLECTOR_HOSTNAME=reflector.yourdomain.com`, and `docker compose up -d` —
> Caddy re-issues the cert. Behind NAT / no public IP instead? Use the
> `cloudflared` (Cloudflare Tunnel) service in the same compose file.

> Render, Railway, and similar container hosts also work — point them at
> `deploy/reflector/Dockerfile`; they provide the `wss://` URL.

### Option C: Cloudflare Tunnel (recommended if you're on Cloudflare)

No public IP, open ports, or manual TLS — Cloudflare serves `wss://` at a
hostname on your domain and tunnels to the reflector. Pairs naturally with the
Cloudflare Pages client below.

1. Run the reflector on any always-on box (your server, a small VM, even a
   spare machine): `cd deploy/reflector && docker compose up -d`.
2. In the Cloudflare dashboard: **Zero Trust → Networks → Tunnels → Create a
   tunnel**. Add a **Public Hostname** — e.g. `reflector.yourdomain.com` —
   pointing at service **`http://reflector:9090`** (or `http://localhost:9090`
   if cloudflared runs on the host). Copy the tunnel token.
3. Put the token in `deploy/reflector/.env` as `TUNNEL_TOKEN=...`, uncomment the
   `cloudflared` service in `docker-compose.yml`, and `docker compose up -d`.

Your reflector is then at `wss://reflector.yourdomain.com`. (Cloudflare proxies
WebSockets by default; the reflector's frequent ticks keep the connection from
idling out.)

---

## Step 2 — Deploy the client

### Cloudflare Pages (served at a root path — no subpath quirks)

The repo IS the static site (no build step), so configure Pages to serve it
directly:

1. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**,
   pick this repo.
2. Build settings: **Framework preset = None**, **Build command = (empty)**,
   **Build output directory = `/`** (the repo root).
3. Set the **Production branch** to whatever you want live (e.g. `main`, or this
   working branch for now).
4. Deploy → your site is at `https://<project>.pages.dev/` (or attach a custom
   domain).

> `apiKey.js` is committed in this repo, so it ships with the site. That's fine
> for standalone mode (the client uses `apiKey:"none"` when `?reflector=` is
> set), but if you'd rather not publish it, add it to `.gitignore` and provide
> it via the host instead.

### Alternative: GitHub Pages (GitHub Actions)

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
