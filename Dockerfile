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

# Build application
RUN pnpm run build

# Set production environment
ENV NODE_ENV=production

# Start the server by default, this can be overwritten at runtime
CMD [ "node", "/app/build" ]
