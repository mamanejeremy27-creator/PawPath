# ─── Build stage ───────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY backend/package.json ./
RUN npm install

COPY backend/ ./
RUN npm run build

# ─── Production stage ──────────────────────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

COPY backend/package.json ./
RUN npm install --only=production

COPY --from=builder /app/dist ./dist

# Create uploads dir (ephemeral on Railway — use a volume or cloud storage for persistence)
RUN mkdir -p uploads

EXPOSE 3004

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 3004) + '/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1) })"

CMD ["node", "dist/main.js"]
