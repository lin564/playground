# Standalone Croquet reflector (the multiplayer sync server).
#
# Apache-2.0 source, vendored from github.com/croquet/croquet (packages/reflector).
# Runs with NO dependency on any Croquet/Multisynq server: --standalone disables
# api.croquet.io key verification, there is no DePIN/wallet involvement, and
# nothing phones home.
#
# TLS is terminated by the host edge (Fly.io / Caddy / nginx), which exposes
# wss:// to browsers; this container only speaks plain ws on port 9090.

FROM node:20-bookworm-slim

# Build toolchain for the one native dependency (fast-crc32c).
RUN apt-get update && apt-get install -y --no-install-recommends \
        python3 make g++ ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev || npm install --omit=dev
COPY . .

# The reflector always listens on 9090 (hardcoded in reflector.js).
EXPOSE 9090

# --standalone : no external API-key verification, no phone-home
# --storage=none: keep session state in memory (no snapshot persistence)
# --no-loglatency: quieter logs
CMD ["node", "reflector.js", "--standalone", "--storage=none", "--no-loglatency"]
