FROM node:20.19-alpine AS deps
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY apps/engine-1/package.json apps/engine-1/package.json
COPY apps/engine-2/package.json apps/engine-2/package.json
COPY packages/simulator-core/package.json packages/simulator-core/package.json
RUN pnpm install --frozen-lockfile=false

FROM deps AS build
COPY . .
RUN pnpm build

FROM node:20.19-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable
COPY --from=build /app /app
ARG APP=engine-1
ENV APP=${APP}
CMD ["sh", "-c", "pnpm --filter @va/simulator-${APP} start"]
