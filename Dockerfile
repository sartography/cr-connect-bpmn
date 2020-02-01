### STAGE 1: Build ###
FROM node:alpine AS builder

RUN mkdir /crc-bpmn
WORKDIR /crc-bpmn

ADD package.json /crc-bpmn/

COPY . /crc-bpmn/

RUN npm install && \
    npm run build:staging

### STAGE 2: Run ###
FROM nginx:alpine
COPY --from=builder /crc-bpmn/dist/cr-connect-bpmn /usr/share/nginx/html/
COPY --from=builder /crc-bpmn/nginx.conf /etc/nginx/conf.d/default.conf
