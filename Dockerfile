# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=18.16.0
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="NodeJS"

# NodeJS app lives here
WORKDIR /app

# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install -y python-is-python3 pkg-config build-essential 

# Install performant npm
RUN npm install -g pnpm

# Install node modules
COPY --link package.json .
COPY --link pnpm-lock.yaml .
RUN pnpm install --frozen-lockfile

# Copy application code
COPY --link . .

# Create/Update/Seed DB
ENV DATABASE_URL="file:/data/prices.db"
RUN pnpm prisma migrate deploy
RUN pnpm prisma db seed

# Build application
RUN pnpm run build

# Final stage for app image
FROM base

# Set production environment
ENV NODE_ENV=production

# Copy built application
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/build /app/build

# Start the server by default, this can be overwritten at runtime
CMD [ "node", "/app/build" ]
