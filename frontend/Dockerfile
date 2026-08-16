FROM node:22-alpine

WORKDIR /app

RUN corepack enable \
    && corepack prepare pnpm@11.2.2 --activate

COPY frontend/package.json frontend/pnpm-lock.yaml frontend/pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

COPY frontend /app

CMD ["pnpm", "dev", "--hostname", "0.0.0.0", "--port", "3000"]