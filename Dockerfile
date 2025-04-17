# Use an official Node runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install build tools needed for some Node packages
RUN apk add --no-cache python3 make g++

# Install app dependencies
# Use a clean install to ensure reproducibility
RUN npm install --only=production --verbose

# Bundle app source
COPY . .

# Make the CLI tool globally available within the container
# This allows running it directly as compress-js
RUN npm link

# Define the entrypoint for the container
ENTRYPOINT ["compress-js"]

# Set default command (optional, useful for showing help)
CMD ["--help"] 