# Deprecated: use backend/Dockerfile in EasyPanel (API service, port 8000)
FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY src ./src
ENV NODE_ENV=production
ENV PORT=8000
ENV HOST=0.0.0.0
EXPOSE 8000
CMD ["node", "src/index.js"]
