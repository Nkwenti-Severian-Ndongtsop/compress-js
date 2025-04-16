FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm link

ENTRYPOINT ["js-compressor"] 