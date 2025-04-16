# Build stage
FROM node:18.19.1-alpine AS builder

WORKDIR /app

# Install pkg for creating standalone executables
RUN npm install -g pkg

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Create standalone executable
RUN pkg . --targets node18-alpine-x64 --output js-compressor

# Final stage - using alpine for minimal size while maintaining compatibility
FROM alpine:3.19

# Copy the standalone executable
COPY --from=builder /app/js-compressor /usr/local/bin/js-compressor

# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

ENTRYPOINT ["js-compressor"] 