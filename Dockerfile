### STAGE 1: Build ###
FROM node:alpine AS builder

RUN mkdir /crc-bpmn
WORKDIR /crc-bpmn

ADD package.json /crc-bpmn/

COPY . /crc-bpmn/

RUN npm install && \
    npm run build:${APP_ENVIRONMENT}

### STAGE 2: Run ###
FROM nginx:alpine
COPY --from=builder /crc-frontend/dist/* /usr/share/nginx/html/
COPY --from=builder /crc-frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./substitute-env-variables.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh
ENTRYPOINT ["./entrypoint.sh", "/usr/share/nginx/html/index.html"]

### STAGE 3: Profit! ###
CMD ["nginx", "-g", "daemon off;"]
