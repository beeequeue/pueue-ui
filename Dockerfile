FROM node:25-alpine AS base

WORKDIR /app

ENV PNPM_HOME=/pnpm
ENV CI=1
# Use production in case any dependencies use it in any way
ENV NODE_ENV=production

FROM base AS deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY patches/ patches/

RUN npm i -g npm@latest
RUN npm i -g --force corepack@latest
RUN corepack enable
RUN corepack prepare --activate

# Install dependencies
RUN --mount=type=cache,target=/pnpm/store \
    pnpm install --frozen-lockfile --ignore-scripts

FROM base AS build

COPY index.html package.json tsconfig.json unocss.config.ts vite.config.ts ./
COPY --from=deps /app/node_modules/ node_modules/
COPY src/ src/
COPY server/ server/

RUN node --run build

FROM base

COPY package.json pnpm-workspace.yaml ./

COPY --from=build /app/.output/ .output/

# Run with...
# Source maps enabled, since it does not affect performance from what I found
ENV NODE_OPTIONS="--enable-source-maps"
# Warnings disabled, we know what we're doing and they're annoying
ENV NODE_NO_WARNINGS=1

CMD ["node", "--run", "start"]
