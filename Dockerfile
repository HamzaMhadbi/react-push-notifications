ARG NODE_VERSION=20.11.0
ARG NODE_IMAGE_FLAVOR=slim

# Base image with build tools
ARG BASE_IMAGE=node:${NODE_VERSION}-${NODE_IMAGE_FLAVOR}

FROM ${BASE_IMAGE} AS front-builder

# Initialize front env vars
ENV REACT_APP_BACK_URI=CLIENT_APP_BACK_URI
ENV REACT_APP_FIREBASE_VAPID=CLIENT_APP_FIREBASE_VAPID
ENV REACT_APP_FIREBASE_API_KEY=CLIENT_APP_FIREBASE_API_KEY
ENV REACT_APP_FIREBASE_AUTH_DOMAIN=CLIENT_APP_FIREBASE_AUTH_DOMAIN
ENV REACT_APP_FIREBASE_PROJECT_ID=CLIENT_APP_FIREBASE_PROJECT_ID
ENV REACT_APP_FIREBASE_MESSAGING_SENDER_ID=CLIENT_APP_FIREBASE_MESSAGING_SENDER_ID
ENV REACT_APP_FIREBASE_APP_ID=CLIENT_APP_FIREBASE_APP_ID
ENV REACT_APP_FIREBASE_MEASUREMENT_ID=CLIENT_APP_FIREBASE_MEASUREMENT_ID
ENV REACT_APP_ADMIN_URI=CLIENT_APP_ADMIN_URI

# Set to user `node`
USER node

# Create app directory (with user `node`)
RUN mkdir -p /home/node

WORKDIR /home/node

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@9+)
COPY front/package.json ./
COPY front/package-lock.json ./
RUN npm ci --omit=optional --no-audit

COPY front/ .
RUN npm run build --production

# -----------------------------------------
# BACK BUILDER
#
FROM ${BASE_IMAGE} AS back-builder

# Set to user `node`
USER node

WORKDIR /home/node

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@9+)
COPY --chown=node package*.json ./
RUN npm ci --no-audit

# Bundle app source code
COPY --chown=node codegen.yml ./codegen.yml
COPY --chown=node .npmrc ./.npmrc
COPY --chown=node tsconfig.json ./tsconfig.json
COPY --chown=node src/ ./src

# Build and create ./dist folder
RUN npm run build
# Copy the GraphQL schema to generate typeDefs
COPY --chown=node src/schema.graphql ./dist/schema.graphql


FROM ${BASE_IMAGE} AS base-production

# RUN adduser node root
USER node

WORKDIR /home/node/

# Copy production modules from builder stage
COPY --from=back-builder --chown=node /home/node/node_modules ./node_modules
COPY --from=back-builder --chown=node /home/node/dist ./dist
COPY --from=front-builder --chown=node /home/node/build ./public
COPY --chown=node runtime_env.sh ./runtime_env.sh

# Make shell script executable
RUN chmod +x runtime_env.sh

# Create Volume 
RUN mkdir ./data
VOLUME ./data
RUN touch ./data/db.json


# init args args
ARG PORT
ARG NODE_ENV
ARG HOST
# Bind to all network interfaces so that it can be mapped to the host OS
# Mapping the ENV with the ARG using default value
ENV PORT=${PORT:-3000} NODE_ENV=${NODE_ENV:-production} HOST=${HOST:-0.0.0.0}

EXPOSE ${PORT}

ENTRYPOINT [ "/home/node/runtime_env.sh" ]
CMD ["node", "./dist/index.js"]
