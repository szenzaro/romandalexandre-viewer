# syntax=docker/dockerfile:1
FROM node:24-alpine AS build-step
RUN mkdir -p /app
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
RUN npm run build --prod
 
FROM nginx:1.28-alpine
COPY --from=build-step /app/dist/romandalexandre-viewer/browser /usr/share/nginx/html