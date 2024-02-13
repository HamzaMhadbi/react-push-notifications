ARG NODE_VERSION=20.11.0
ARG NODE_IMAGE_FLAVOR=slim
ARG NGINX_VERSION=1.25.1
ARG NGINX_IMAGE_FLAVOR=alpine-slim

# Base Node image with build tools
ARG BASE_IMAGE=node:${NODE_VERSION}-${NODE_IMAGE_FLAVOR}
ARG NGINX_IMAGE=nginx:${NGINX_VERSION}-${NGINX_IMAGE_FLAVOR}

FROM ${BASE_IMAGE} AS builder

# Initialize front env vars
ENV REACT_APP_BACK_URI=CLIENT_APP_BACK_URI

# Set to user `node`
USER node

# Create app directory (with user `node`)
RUN mkdir -p /home/node

WORKDIR /home/node

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@9+)
COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm ci --omit=optional --no-audit

# Copy project content and build
COPY ./ .
RUN npm run build --production

# Base Nginx image with build tools
FROM ${NGINX_IMAGE} AS production

WORKDIR /usr/share/nginx/html

# Copy production modules from builder stage
COPY --from=builder /home/node/build .
# This script will run automatically when the container starts
COPY ./runtime_env.sh  /docker-entrypoint.d/docker-entrypoint.sh
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Install bash
RUN apk add --no-cache bash

RUN chmod a+wx /etc/nginx/conf.d


# Init args
ARG PORT
ARG HOST

# USER 1000

# Bind to all network interfaces so that it can be mapped to the host OS
# Mapping the ENV with the ARG using default value
ENV PORT=${PORT:-80} HOST=${HOST:-0.0.0.0}

EXPOSE ${PORT}
ENTRYPOINT [ "/docker-entrypoint.d/docker-entrypoint.sh" ]
CMD sed -i -e 's/$PORT/'"$PORT"'/g; s/$HOST/'"$HOST"'/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'
