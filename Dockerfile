# Build stage
FROM node:18.19.1-alpine AS builder

WORKDIR /app

# Install build tools and compression utilities
RUN apk add --no-cache \
    upx \
    binutils \
    && npm install -g pkg

# Copy only package files
COPY package*.json ./

# Install production dependencies only
RUN npm install --production

# Copy only necessary source files
COPY *.js ./

# Create standalone executable with stripped symbols and optimized compression
RUN pkg . --targets node18-alpine-x64 --output js-compressor && \
    strip --strip-all js-compressor && \
    upx --best --lzma js-compressor

# Final stage - using scratch for absolute minimal size
FROM scratch

# Copy only the compressed executable
COPY --from=builder /app/js-compressor /js-compressor

# Set the entrypoint
ENTRYPOINT ["/js-compressor"] 