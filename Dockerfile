FROM node:alpine AS builder

RUN mkdir /crc-bpmn
WORKDIR /crc-bpmn

ADD package.json /crc-bpmn/

COPY . /crc-bpmn/

RUN npm install && \
    npm run build:staging

FROM nginx:alpine

COPY --from=builder /crc-bpmn/dist/* /usr/share/nginx/html/

