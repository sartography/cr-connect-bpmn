### STAGE 1: Build ###
FROM node:12.7-alpine AS build
RUN mkdir /crc-bpmn
WORKDIR /crc-bpmn
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build:staging

### STAGE 2: Run ###
FROM nginx:1.17.1-alpine
COPY --from=build /crc-bpmn/dist/cr-connect-bpmn /usr/share/nginx/html

# expose ports
EXPOSE 80
