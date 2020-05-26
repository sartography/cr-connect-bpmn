### STAGE 1: Build ###
FROM node AS builder

RUN mkdir /crc-bpmn
WORKDIR /crc-bpmn

ADD package.json /crc-bpmn/
ADD package-lock.json /crc-bpmn/

COPY . /crc-bpmn/

ARG build_config=prod
RUN npm install && \
    npm run build:$build_config

### STAGE 2: Run ###
FROM nginx:alpine
RUN set -x && apk add --update --no-cache bash libintl gettext curl

COPY --from=builder /crc-bpmn/dist/* /etc/nginx/html/
COPY --from=builder /crc-bpmn/nginx.conf /etc/nginx/conf.d/default.conf

# Script for substituting environment variables
COPY ./docker/substitute-env-variables.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

# Substitute environment variables in nginx configuration and index.html
RUN ["./entrypoint.sh", \
            "/etc/nginx/html/index.html,/etc/nginx/conf.d/default.conf", \
            "PRODUCTION,API_URL,IRB_URL,HOME_ROUTE,BASE_HREF,PORT0", \
            "/etc/nginx/html"]

### STAGE 3: Profit! ###
CMD /usr/sbin/nginx -g "daemon off;"
