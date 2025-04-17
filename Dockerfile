# Stage 1: Builder
FROM node:18-alpine AS builder

WORKDIR /app

# Install build tools needed for some Node packages
# Do this before copying package.json to potentially cache this layer
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install production dependencies
# Using npm ci for reproducibility if possible, otherwise use install
# RUN npm ci --only=production
# If ci failed previously, stick with install for now
RUN npm install --only=production --verbose

# Copy the rest of the application source code
COPY . .

# If you have a build step (e.g., TypeScript), run it here
# RUN npm run build

# Stage 2: Final image
FROM node:18-alpine

WORKDIR /app

# Copy production node_modules from builder stage
COPY --from=builder /app/node_modules ./node_modules

# Copy necessary source files and package.json
COPY --from=builder /app/package.json ./
COPY --from=builder /app/index.js ./
COPY --from=builder /app/lz.js ./
COPY --from=builder /app/rle.js ./

# Define the entrypoint for the container to run the script directly
# Assumes index.js is the main executable script
ENTRYPOINT ["node", "./index.js"]

# Set default command (optional, useful for showing help)
CMD ["--help"] 