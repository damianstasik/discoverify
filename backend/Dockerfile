FROM node:18.15.0-alpine3.17 AS builder

RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app
RUN npm i --global turbo
COPY . .
RUN turbo prune --scope=backend --docker

FROM node:18.15.0-alpine3.17 AS installer

RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json
RUN npm i
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
RUN npm run build:backend
 
FROM node:18.15.0-alpine3.17 AS runner

WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs
USER nodejs
COPY --from=installer /app/backend/dist .
CMD node server.js
