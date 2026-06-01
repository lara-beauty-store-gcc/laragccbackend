FROM node:20-alpine
WORKDIR /app

RUN apk add --no-cache libc6-compat \
  && addgroup -g 1001 -S nodejs \
  && adduser -S -u 1001 -G nodejs nodejs

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY src ./src

ENV NODE_ENV=production
ENV PORT=8000

USER nodejs
EXPOSE 8000

CMD ["node", "src/index.js"]
