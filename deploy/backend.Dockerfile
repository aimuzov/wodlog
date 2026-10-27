# API: Node запускает TypeScript сам, сборка не нужна. Из зависимостей только @sentry/node,
# весь фронт в devDependencies и сюда не ставится.
# Контекст сборки -- корень репо: API берёт типы и логику из src/shared.

FROM node:26.11.1-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund --loglevel=error
COPY src/shared ./src/shared
COPY src/backend ./src/backend
# База и фото досок живут в volume. Каталог создаётся здесь, чтобы новый пустой volume
# унаследовал владельца node и API мог в него писать.
RUN mkdir /data && chown node:node /data
ENV DATA_DIR=/data
USER node
EXPOSE 8787
CMD ["node", "src/backend/server.ts"]
