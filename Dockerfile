# Stage 1: Builder
FROM node:18-alpine AS builder

WORKDIR /app

# Install build tools if they are needed by dependencies for pkg compilation
# Keep this minimal if possible, pkg might not need them itself
RUN apk update && apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies for pkg)
RUN npm install --verbose

# Copy the rest of the application source code
COPY . .

# Build the standalone executable for Alpine Linux
RUN npx pkg . --targets node18-alpine-x64 --output /app/compress-js-alpine

# Stage 2: Final minimal image
FROM alpine:latest

WORKDIR /app

# Copy only the compiled executable from the builder stage
COPY --from=builder /app/compress-js-alpine .

# Define the entrypoint for the container
ENTRYPOINT ["/app/compress-js-alpine"]

# Set default command (optional, useful for showing help)
CMD ["--help"] 